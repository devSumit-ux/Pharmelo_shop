
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Store, MessageSquare, Settings, 
  LogOut, TrendingUp, Sparkles, Loader2, Save, ExternalLink, AlertTriangle,
  ChevronRight, Search, Bell, Check, X, Info, ClipboardList, PenLine, Mail, Send,
  Zap, Clock, Play, Map, Key, Download, FileText, Printer
} from 'lucide-react';
import { useAppConfig } from '../context/AppContext';
import { analyzeBatchFeedback, generateNewsletter } from '../services/geminiService';
import { AdminStats, AppConfig, RoadmapPhase } from '../types';

type Tab = 'overview' | 'waitlist' | 'partners' | 'feedback' | 'campaigns' | 'roadmap' | 'settings';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { config, refreshConfig } = useAppConfig();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Data States
  const [metrics, setMetrics] = useState({
    waitlist: { total: 0, growth: 0 },
    partners: { total: 0, growth: 0 },
    community: { total: 0, growth: 0 },
    feedback: { total: 0, growth: 0 }
  });

  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  
  // Feedback View State
  const [feedbackView, setFeedbackView] = useState<'surveys' | 'notes'>('surveys');
  
  // Notification State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<AppConfig>(config);
  
  // AI State
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Newsletter State
  const [newsletterDraft, setNewsletterDraft] = useState<{subject: string, body: string} | null>(null);
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [pastCampaigns, setPastCampaigns] = useState<any[]>([]);
  
  // Automation State
  const [testingAutomation, setTestingAutomation] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchData();
    
    // Subscribe to Realtime Updates
    const channel = supabase
      .channel('admin-dashboard-realtime')
      // Notifications
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_notifications' },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
        }
      )
      // Roadmap Realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'roadmap_phases' },
        (payload) => {
           // Reload roadmap fully on any change to keep sorting simple
           fetchRoadmap(); 
        }
      )
      .subscribe();
    
    // Close notification dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        supabase.removeChannel(channel);
    };
  }, []);

  // Sync form with config when config loads
  useEffect(() => {
    setSettingsForm(config);
  }, [config]);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      navigate('/admin');
    }
  };

  const fetchRoadmap = async () => {
      const { data } = await supabase.from('roadmap_phases').select('*').order('order_index', { ascending: true });
      if (data) setRoadmap(data as RoadmapPhase[]);
  }

  const fetchData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const { error: checkError } = await supabase.from('waitlist_users').select('id').limit(1);
      
      if (checkError && checkError.code === '42P01') {
        throw new Error('Database tables not found. Please run the db_schema.sql script in Supabase SQL Editor.');
      }

      // --- CALCULATE GROWTH METRICS ---
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateIso = thirtyDaysAgo.toISOString();

      const fetchMetric = async (table: string) => {
          const { count: total } = await supabase.from(table).select('*', { count: 'exact', head: true });
          const { count: recent } = await supabase.from(table).select('*', { count: 'exact', head: true }).gt('created_at', dateIso);
          return { total: total || 0, recent: recent || 0 };
      };

      const wData = await fetchMetric('waitlist_users');
      const pData = await fetchMetric('early_partners');
      const cData = await fetchMetric('saturday_community_members');
      const fData = await fetchMetric('feedback_submissions');
      const sData = await fetchMetric('survey_responses');
      
      const combinedFeedbackTotal = fData.total + sData.total;
      const combinedFeedbackRecent = fData.recent + sData.recent;

      const calcGrowth = (total: number, recent: number) => {
          const prev = total - recent;
          if (prev <= 0) return total > 0 ? 100 : 0; 
          return Math.round((recent / prev) * 100);
      };

      setMetrics({
          waitlist: { total: wData.total, growth: calcGrowth(wData.total, wData.recent) },
          partners: { total: pData.total, growth: calcGrowth(pData.total, pData.recent) },
          community: { total: cData.total, growth: calcGrowth(cData.total, cData.recent) },
          feedback: { total: combinedFeedbackTotal, growth: calcGrowth(combinedFeedbackTotal, combinedFeedbackRecent) }
      });

      // --- FETCH LISTS ---
      const notifRes = await supabase.from('admin_notifications').select('*').order('created_at', { ascending: false }).limit(10);
      if (notifRes.data) setNotifications(notifRes.data);

      await fetchRoadmap();

      if (wData.total) {
          const { data } = await supabase.from('waitlist_users').select('*').order('created_at', { ascending: false }).limit(100);
          if (data) setWaitlist(data);
      }
      
      if (pData.total) {
          const { data } = await supabase.from('early_partners').select('*').order('created_at', { ascending: false }).limit(100);
          if (data) setPartners(data);
      }

      if (fData.total) {
          const { data } = await supabase.from('feedback_submissions').select('*').order('created_at', { ascending: false }).limit(100);
          if (data) setFeedback(data);
      }

      if (sData.total) {
          const { data } = await supabase.from('survey_responses').select('*').order('created_at', { ascending: false }).limit(100);
          if (data) setSurveys(data);
      }

      const { data: campaignData, error: campaignError } = await supabase.from('newsletter_campaigns').select('*').order('created_at', { ascending: false });
      if (!campaignError && campaignData) {
          setPastCampaigns(campaignData);
      }

    } catch (e: any) {
      console.error("Error fetching admin data", e);
      setDbError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // --- EXPORT UTILITIES ---
  
  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    
    // Get headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const cell = row[header];
          // Handle objects, arrays, or commas in strings
          if (typeof cell === 'object') return `"${JSON.stringify(cell).replace(/"/g, '""')}"`;
          return `"${String(cell).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printDataAsPDF = (title: string, data: any[]) => {
    if (!data.length) return;
    
    // Flatten data if needed (basic flattening)
    const flatData = data.map(row => {
        const newRow: any = {};
        Object.keys(row).forEach(key => {
            if (typeof row[key] === 'object' && row[key] !== null) {
                newRow[key] = JSON.stringify(row[key]);
            } else {
                newRow[key] = row[key];
            }
        });
        return newRow;
    });

    const headers = Object.keys(flatData[0]);

    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Print Report</title>');
    printWindow.document.write('<style>body{font-family:sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; font-size:12px;} th, td{border:1px solid #ddd; padding:8px; text-align:left;} th{background-color:#f8f9fa;} h1{color:#0f172a; margin-bottom:20px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<h1>${title}</h1>`);
    printWindow.document.write('<table><thead><tr>');
    headers.forEach(h => printWindow.document.write(`<th>${h.toUpperCase()}</th>`));
    printWindow.document.write('</tr></thead><tbody>');
    
    flatData.forEach(row => {
        printWindow.document.write('<tr>');
        headers.forEach(h => {
            const val = row[h] !== undefined && row[h] !== null ? row[h] : '';
            printWindow.document.write(`<td>${val}</td>`);
        });
        printWindow.document.write('</tr>');
    });
    
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const updateRoadmapPhase = async (id: string, updates: Partial<RoadmapPhase>) => {
      try {
          const { error } = await supabase.from('roadmap_phases').update(updates).eq('id', id);
          if (error) throw error;
          setRoadmap(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      } catch (e: any) {
          alert("Failed to update phase: " + e.message);
      }
  };

  const handleSettingsSave = async () => {
    try {
      const { error } = await supabase
        .from('app_config')
        .update(settingsForm)
        .eq('id', settingsForm.id || 1);

      if (error) throw error;
      await refreshConfig();
      alert('Settings saved successfully!');
    } catch (e: any) {
      alert('Error saving settings: ' + e.message);
    }
  };

  const markNotificationRead = async (id: number) => {
     setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
     await supabase.from('admin_notifications').update({ is_read: true }).eq('id', id);
  };
  
  const markAllRead = async () => {
     const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
     if (unreadIds.length === 0) return;
     setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
     await supabase.from('admin_notifications').update({ is_read: true }).in('id', unreadIds);
  };

  const runAiAnalysis = async () => {
    setAnalyzing(true);
    const noteContent = feedback.map(f => `[Note from ${f.role}]: ${f.content}`);
    const surveyContent = surveys.map(s => {
        const answers = s.answers || {};
        const { additional_comments, ...choices } = answers;
        const choiceString = Object.entries(choices).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ');
        const commentString = additional_comments ? `User Comment: "${additional_comments}"` : 'No written comment';
        return `[Survey from ${s.role}]: ${commentString}. (Selected Options: ${choiceString})`;
    });

    const textData = [...noteContent, ...surveyContent];
    if (textData.length === 0) {
        alert("No data found.");
        setAnalyzing(false);
        return;
    }

    try {
        const result = await analyzeBatchFeedback(textData);
        if (result) setAiAnalysis(result);
    } catch (e: any) {
        alert("Error during analysis: " + e.message);
    } finally {
        setAnalyzing(false);
    }
  };

  const handleGenerateNewsletter = async () => {
      setGeneratingEmail(true);
      try {
          const result = await generateNewsletter({
              waitlist: metrics.waitlist.total,
              partners: metrics.partners.total,
              community: metrics.community.total
          });
          setNewsletterDraft(result);
      } catch (e) {
          alert("Failed to generate newsletter.");
      } finally {
          setGeneratingEmail(false);
      }
  };

  const handleSendNewsletter = async () => {
      if (!newsletterDraft) return;
      setSendingEmail(true);
      try {
          const { error } = await supabase.from('newsletter_campaigns').insert([{
              subject: newsletterDraft.subject,
              content: newsletterDraft.body,
              recipient_count: metrics.waitlist.total + metrics.community.total,
              status: 'sent',
              sent_at: new Date().toISOString()
          }]);

          if (error && error.code !== '42P01') throw error;

          alert("Newsletter Sent! (Simulated)");
          setNewsletterDraft(null);
          const { data } = await supabase.from('newsletter_campaigns').select('*').order('created_at', { ascending: false });
          if (data) setPastCampaigns(data);

      } catch (e: any) {
          alert("Error sending: " + e.message);
      } finally {
          setSendingEmail(false);
      }
  };

  // --- AUTOMATION TESTER ---
  const handleTestAutomation = async () => {
    setTestingAutomation(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-weekly-update');
      
      if (error) throw error;
      
      alert(`Automation Test Success!\nAPI Response: ${JSON.stringify(data)}`);
      const { data: cData } = await supabase.from('newsletter_campaigns').select('*').order('created_at', { ascending: false });
      if (cData) setPastCampaigns(cData);

    } catch (e: any) {
      console.error(e);
      if (e.message?.includes('FunctionsFetchError') || e.message?.includes('404')) {
         alert("API Not Found. You need to deploy the 'send-weekly-update' Edge Function to Supabase first using the CLI.");
      } else {
         alert("Automation Error: " + e.message);
      }
    } finally {
      setTestingAutomation(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        <span className="text-slate-500 font-medium">Loading Dashboard...</span>
      </div>
    </div>
  );

  const NavItem = ({ id, icon: Icon, label }: { id: Tab; icon: any; label: string }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
        activeTab === id 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'text-white' : 'text-slate-400 group-hover:text-white'} /> 
      <span className="font-medium relative z-10">{label}</span>
      {activeTab === id && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 z-0" />}
    </button>
  );
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] fixed h-full overflow-y-auto z-30 border-r border-slate-800 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">M</div>
             <h1 className="text-xl font-bold text-white tracking-tight">Medzo Admin</h1>
          </div>
          <p className="text-xs text-slate-500 ml-11">Version 1.0.4</p>
        </div>

        <nav className="px-4 space-y-2 flex-1">
          <div className="px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-wider">Main Menu</div>
          <NavItem id="overview" icon={LayoutDashboard} label="Overview" />
          <NavItem id="waitlist" icon={Users} label="Waitlist" />
          <NavItem id="partners" icon={Store} label="Pharmacy Partners" />
          <NavItem id="roadmap" icon={Map} label="Roadmap Config" />
          <NavItem id="feedback" icon={MessageSquare} label="Feedback & AI" />
          <NavItem id="campaigns" icon={Mail} label="Auto-Pilot Campaigns" />
          
          <div className="px-4 py-2 mt-6 text-xs font-bold text-slate-600 uppercase tracking-wider">System</div>
          <NavItem id="settings" icon={Settings} label="Global Settings" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors group">
            <LogOut size={20} className="group-hover:text-red-400" /> 
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-8 lg:p-12">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-10">
           <div>
              <h2 className="text-3xl font-bold text-slate-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
              <p className="text-slate-500 mt-1">Manage your application data and settings.</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative">
                 <input type="text" placeholder="Search data..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 w-64 shadow-sm" />
                 <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
              </div>
              
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all relative"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>}
                  </button>
                  
                  {showNotifDropdown && (
                      <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-fade-in origin-top-right">
                          <div className="p-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wide">Notifications</h3>
                              {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-[10px] text-blue-600 font-bold hover:underline">Mark all read</button>
                              )}
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                              {notifications.length === 0 ? (
                                  <div className="p-8 text-center text-slate-400 text-xs">No notifications yet.</div>
                              ) : (
                                  notifications.map(n => (
                                      <div 
                                        key={n.id} 
                                        onClick={() => markNotificationRead(n.id)}
                                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                                      >
                                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.is_read ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                                          <div>
                                              <div className="flex items-center gap-2 mb-1">
                                                  {n.type === 'success' && <div className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">SUCCESS</div>}
                                                  {n.type === 'warning' && <div className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">ALERT</div>}
                                                  {n.type === 'info' && <div className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">INFO</div>}
                                                  <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                              </div>
                                              <p className="text-sm font-bold text-slate-800 leading-tight mb-1">{n.title}</p>
                                              <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>
                  )}
              </div>
           </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                  { label: "Total Waitlist", val: metrics.waitlist.total, growth: metrics.waitlist.growth, color: "blue", icon: Users },
                  { label: "Partner Apps", val: metrics.partners.total, growth: metrics.partners.growth, color: "emerald", icon: Store },
                  { label: "Community", val: metrics.community.total, growth: metrics.community.growth, color: "violet", icon: Sparkles },
                  { label: "Total Feedback", val: metrics.feedback.total, growth: metrics.feedback.growth, color: "amber", icon: MessageSquare }
              ].map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 transition-all">
                      <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl bg-${item.color}-50 text-${item.color}-600`}>
                              <item.icon size={24} />
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                             item.growth >= 0 ? `bg-${item.color}-50 text-${item.color}-600` : 'bg-red-50 text-red-600'
                          }`}>
                            {item.growth > 0 ? '+' : ''}{item.growth}%
                          </span>
                      </div>
                      <div className="text-slate-500 text-sm font-bold uppercase tracking-wide mb-1">{item.label}</div>
                      <div className="text-4xl font-bold text-slate-900">{item.val}</div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* WAITLIST TAB */}
        {activeTab === 'waitlist' && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-900">Waitlist Users</h3>
                    <div className="text-sm text-slate-500">Total: {metrics.waitlist.total}</div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => exportToCSV(waitlist, 'waitlist')} className="text-xs font-bold text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                        <Download size={14} /> CSV
                    </button>
                    <button onClick={() => printDataAsPDF('Waitlist Users', waitlist)} className="text-xs font-bold text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                        <Printer size={14} /> PDF
                    </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold">
                    <tr>
                      <th className="p-4">Email</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">Joined At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {waitlist.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-900">{user.email}</td>
                        <td className="p-4 text-slate-500">{user.source || 'Website'}</td>
                        <td className="p-4 text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {waitlist.length === 0 && (
                      <tr><td colSpan={3} className="p-8 text-center text-slate-400">No users yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PARTNERS TAB */}
        {activeTab === 'partners' && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-900">Partner Applications</h3>
                    <div className="text-sm text-slate-500">Total: {metrics.partners.total}</div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => exportToCSV(partners, 'partners')} className="text-xs font-bold text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                        <Download size={14} /> CSV
                    </button>
                    <button onClick={() => printDataAsPDF('Partner Applications', partners)} className="text-xs font-bold text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                        <Printer size={14} /> PDF
                    </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold">
                    <tr>
                      <th className="p-4">Pharmacy</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">License</th>
                      <th className="p-4">Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {partners.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{p.pharmacy_name}</div>
                        </td>
                        <td className="p-4 text-slate-600">{p.owner_name}</td>
                        <td className="p-4">
                          <div className="text-slate-900">{p.phone}</div>
                          <div className="text-xs text-slate-400">{p.email}</div>
                        </td>
                        <td className="p-4 text-slate-600 font-mono text-xs">{p.license_no}</td>
                        <td className="p-4 text-slate-500 max-w-xs truncate">{p.address}</td>
                      </tr>
                    ))}
                    {partners.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-400">No applications yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="animate-fade-in space-y-6">
            {/* Controls */}
            <div className="flex justify-between items-center">
                <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                    <button onClick={() => setFeedbackView('surveys')} className={`px-4 py-2 rounded-lg text-sm font-bold ${feedbackView === 'surveys' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Surveys</button>
                    <button onClick={() => setFeedbackView('notes')} className={`px-4 py-2 rounded-lg text-sm font-bold ${feedbackView === 'notes' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Direct Notes</button>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => exportToCSV(feedbackView === 'surveys' ? surveys : feedback, `feedback_${feedbackView}`)}
                        className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Download size={14} /> CSV
                    </button>
                    <button 
                        onClick={() => printDataAsPDF(`${feedbackView === 'surveys' ? 'Survey Responses' : 'Feedback Notes'}`, feedbackView === 'surveys' ? surveys : feedback)}
                        className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Printer size={14} /> PDF
                    </button>
                    <button 
                        onClick={runAiAnalysis}
                        disabled={analyzing}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all disabled:opacity-70"
                    >
                        {analyzing ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                        Analyze with Gemini
                    </button>
                </div>
            </div>

            {/* AI Result Section */}
            {aiAnalysis && (
                <div className="bg-indigo-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl animate-slide-up">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Sparkles className="text-yellow-400"/> AI Executive Summary</h3>
                        <p className="text-indigo-200 text-lg mb-6 max-w-2xl">{aiAnalysis.executive_summary}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm">
                                <h4 className="font-bold text-indigo-300 text-xs uppercase mb-3">Top Themes</h4>
                                <ul className="space-y-2">
                                    {aiAnalysis.top_themes?.map((t: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-sm font-medium"><div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"/> {t}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm">
                                <h4 className="font-bold text-indigo-300 text-xs uppercase mb-3">Sentiment</h4>
                                <div className="flex items-end gap-2 h-16 mb-2">
                                     <div style={{height: aiAnalysis.sentiment_breakdown?.positive || '33%'}} className="flex-1 bg-green-500 rounded-t-lg opacity-80"></div>
                                     <div style={{height: aiAnalysis.sentiment_breakdown?.neutral || '33%'}} className="flex-1 bg-gray-400 rounded-t-lg opacity-80"></div>
                                     <div style={{height: aiAnalysis.sentiment_breakdown?.negative || '33%'}} className="flex-1 bg-red-500 rounded-t-lg opacity-80"></div>
                                </div>
                                <div className="flex justify-between text-xs text-indigo-200">
                                     <span>Pos</span><span>Neu</span><span>Neg</span>
                                </div>
                            </div>
                            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                                <h4 className="font-bold text-indigo-300 text-xs uppercase mb-3">Recommended Actions</h4>
                                <ul className="space-y-2">
                                     {aiAnalysis.recommended_features?.map((f: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-sm font-bold text-white"><Check size={14} className="text-green-400"/> {f}</li>
                                     ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {feedbackView === 'surveys' ? (
                     surveys.length === 0 ? <div className="text-center p-12 text-slate-400">No surveys found.</div> :
                     surveys.map(s => (
                         <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between mb-4">
                                <span className="text-xs font-bold uppercase text-slate-400">Survey Response</span>
                                <span className="text-xs text-slate-400">{new Date(s.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                 {Object.entries(s.answers).map(([key, val]: any) => (
                                     key !== 'additional_comments' && (
                                         <span key={key} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600">
                                             <span className="font-bold text-slate-400 uppercase mr-1">{key.replace(/_/g, ' ')}:</span> {val}
                                         </span>
                                     )
                                 ))}
                            </div>
                            {s.answers.additional_comments && (
                                <div className="bg-amber-50 p-3 rounded-xl text-sm text-amber-900 border border-amber-100">
                                    <span className="font-bold block text-xs text-amber-700 uppercase mb-1">Comment</span>
                                    "{s.answers.additional_comments}"
                                </div>
                            )}
                         </div>
                     ))
                ) : (
                     feedback.length === 0 ? <div className="text-center p-12 text-slate-400">No feedback notes found.</div> :
                     feedback.map(f => (
                         <div key={f.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-4">
                            <div className={`p-3 rounded-xl h-fit ${f.role === 'CONSUMER' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                {f.role === 'CONSUMER' ? <Users size={20}/> : <Store size={20}/>}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase mb-1">{f.role} • {new Date(f.created_at).toLocaleDateString()}</div>
                                <p className="text-slate-800 font-medium leading-relaxed">"{f.content}"</p>
                            </div>
                         </div>
                     ))
                )}
            </div>
          </div>
        )}

        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Generator */}
             <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                   <div className="flex items-center gap-3 mb-6">
                       <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><Sparkles size={24}/></div>
                       <h3 className="text-xl font-bold text-slate-900">AI Newsletter Pilot</h3>
                   </div>
                   <p className="text-slate-500 mb-6">Generate and send weekly updates to the waitlist automatically.</p>
                   
                   <button 
                     onClick={handleGenerateNewsletter}
                     disabled={generatingEmail}
                     className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg disabled:opacity-70 flex justify-center gap-2 items-center"
                   >
                     {generatingEmail ? <Loader2 className="animate-spin"/> : <Zap size={18}/>}
                     Generate This Week's Update
                   </button>

                   <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                      <button onClick={handleTestAutomation} disabled={testingAutomation} className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 w-full">
                         {testingAutomation ? <Loader2 className="animate-spin w-3 h-3"/> : <Play size={12}/>} Test Trigger Automation (Edge Function)
                      </button>
                   </div>
                </div>

                {newsletterDraft && (
                    <div className="bg-white border border-indigo-100 rounded-3xl overflow-hidden shadow-xl animate-fade-in ring-4 ring-indigo-50">
                       <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                           <span className="font-bold text-sm">Preview</span>
                           <button onClick={() => setNewsletterDraft(null)} className="hover:bg-indigo-500 p-1 rounded"><X size={16}/></button>
                       </div>
                       <div className="p-6">
                           <div className="mb-4">
                               <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Subject</label>
                               <input 
                                   value={newsletterDraft.subject} 
                                   onChange={e => setNewsletterDraft({...newsletterDraft, subject: e.target.value})}
                                   className="w-full font-bold text-lg text-slate-900 border-b border-slate-200 pb-2 focus:outline-none focus:border-indigo-500"
                               />
                           </div>
                           <div className="mb-6">
                               <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Body Content</label>
                               <textarea 
                                   value={newsletterDraft.body} 
                                   onChange={e => setNewsletterDraft({...newsletterDraft, body: e.target.value})}
                                   className="w-full h-48 text-slate-900 text-sm leading-relaxed border border-slate-100 rounded-xl p-3 focus:outline-none focus:border-indigo-500 resize-none"
                               />
                           </div>
                           <button 
                               onClick={handleSendNewsletter}
                               disabled={sendingEmail}
                               className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 flex justify-center items-center gap-2"
                           >
                               {sendingEmail ? <Loader2 className="animate-spin"/> : <Send size={18}/>}
                               Send to {metrics.waitlist.total + metrics.community.total} Users
                           </button>
                       </div>
                    </div>
                )}
             </div>

             {/* History */}
             <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden h-fit">
                 <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                     <h3 className="font-bold text-slate-900">Campaign History</h3>
                     <div className="flex gap-2">
                        <button onClick={() => exportToCSV(pastCampaigns, 'campaign_history')} className="text-xs font-bold text-slate-500 hover:bg-slate-100 p-2 rounded-lg"><Download size={16}/></button>
                     </div>
                 </div>
                 <div className="divide-y divide-slate-100">
                     {pastCampaigns.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm">No campaigns sent yet.</div> : 
                       pastCampaigns.map(c => (
                           <div key={c.id} className="p-6 hover:bg-slate-50 transition-colors">
                               <div className="flex justify-between mb-2">
                                   <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">{c.status}</span>
                                   <span className="text-xs text-slate-400">{new Date(c.sent_at).toLocaleDateString()}</span>
                               </div>
                               <h4 className="font-bold text-slate-900 text-sm mb-1">{c.subject}</h4>
                               <div className="text-xs text-slate-500">Recipients: {c.recipient_count}</div>
                           </div>
                       ))
                     }
                 </div>
             </div>
          </div>
        )}
        
        {/* ROADMAP CONFIG TAB */}
        {activeTab === 'roadmap' && (
          <div className="animate-fade-in space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-900 mb-1">Roadmap Configuration</h3>
                    <p className="text-slate-500 text-sm">Update the phases shown on the public roadmap page in real-time.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => exportToCSV(roadmap, 'roadmap_config')} className="text-xs font-bold text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                        <Download size={14} /> CSV
                    </button>
                    <button onClick={() => printDataAsPDF('Roadmap Config', roadmap)} className="text-xs font-bold text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                        <Printer size={14} /> PDF
                    </button>
                </div>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                {roadmap.map((phase) => (
                   <div key={phase.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start gap-4 mb-4">
                          <div className="flex-1">
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
                              <input 
                                  value={phase.title} 
                                  onChange={e => updateRoadmapPhase(phase.id, { title: e.target.value })}
                                  className="font-bold text-lg text-slate-900 w-full border-b border-slate-200 bg-slate-50 rounded-lg px-2 py-1 focus:border-blue-500 focus:outline-none transition-colors"
                              />
                          </div>
                          <div className="w-40">
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
                              <select 
                                  value={phase.status}
                                  onChange={e => updateRoadmapPhase(phase.id, { status: e.target.value as any })}
                                  className={`w-full text-xs font-bold px-3 py-2 rounded-lg border ${
                                     phase.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                     phase.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                     'bg-slate-50 text-slate-900 border-slate-200'
                                  }`}
                              >
                                  <option value="upcoming">Upcoming</option>
                                  <option value="active">Active</option>
                                  <option value="completed">Completed</option>
                              </select>
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                              <textarea 
                                  value={phase.description} 
                                  onChange={e => updateRoadmapPhase(phase.id, { description: e.target.value })}
                                  rows={2}
                                  className="w-full text-sm text-slate-900 bg-white rounded-lg p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Display Date/Label</label>
                              <input 
                                  value={phase.date_display} 
                                  onChange={e => updateRoadmapPhase(phase.id, { date_display: e.target.value })}
                                  className="w-full text-sm text-slate-900 bg-white rounded-lg p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                              />
                          </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
        
        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="animate-fade-in max-w-2xl">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">General Configuration</h3>
                    <div className="space-y-6">
                        {/* API KEY SECTION */}
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                           <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-amber-100 rounded-lg text-amber-700"><Key size={20} /></div>
                              <h4 className="font-bold text-amber-900">Gemini API Key</h4>
                           </div>
                           <p className="text-sm text-amber-800 mb-4">
                             Update this key if you run out of credits. The new key will be applied immediately for all users.
                           </p>
                           <input 
                              type="text" 
                              value={settingsForm.gemini_api_key || ''}
                              onChange={e => setSettingsForm({...settingsForm, gemini_api_key: e.target.value})}
                              className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-500"
                              placeholder="AIza..."
                           />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">App Name</label>
                            <input 
                                type="text" 
                                value={settingsForm.app_name}
                                onChange={e => setSettingsForm({...settingsForm, app_name: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Logo URL</label>
                            <input 
                                type="text" 
                                value={settingsForm.logo_url}
                                onChange={e => setSettingsForm({...settingsForm, logo_url: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Contact Email</label>
                            <input 
                                type="email" 
                                value={settingsForm.contact_email}
                                onChange={e => setSettingsForm({...settingsForm, contact_email: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 mb-4">Social Links</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="w-24 text-xs font-bold text-slate-500">Twitter</span>
                                    <input 
                                        type="text" 
                                        value={settingsForm.twitter_url}
                                        onChange={e => setSettingsForm({...settingsForm, twitter_url: e.target.value})}
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="w-24 text-xs font-bold text-slate-500">Instagram</span>
                                    <input 
                                        type="text" 
                                        value={settingsForm.instagram_url}
                                        onChange={e => setSettingsForm({...settingsForm, instagram_url: e.target.value})}
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="w-24 text-xs font-bold text-slate-500">LinkedIn</span>
                                    <input 
                                        type="text" 
                                        value={settingsForm.linkedin_url}
                                        onChange={e => setSettingsForm({...settingsForm, linkedin_url: e.target.value})}
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button 
                                onClick={handleSettingsSave}
                                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
