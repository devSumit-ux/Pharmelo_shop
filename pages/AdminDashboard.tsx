import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Store, MessageSquare, Settings, 
  LogOut, TrendingUp, Sparkles, Loader2, Save, ExternalLink, AlertTriangle,
  ChevronRight, Search, Bell, Check, X, Info, ClipboardList, PenLine, Mail, Send,
  Zap, Clock, Play, Map
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
          const { data } = await supabase.from('waitlist_users').select('*').order('created_at', { ascending: false }).limit(50);
          if (data) setWaitlist(data);
      }
      
      if (pData.total) {
          const { data } = await supabase.from('early_partners').select('*').order('created_at', { ascending: false }).limit(50);
          if (data) setPartners(data);
      }

      if (fData.total) {
          const { data } = await supabase.from('feedback_submissions').select('*').order('created_at', { ascending: false }).limit(50);
          if (data) setFeedback(data);
      }

      if (sData.total) {
          const { data } = await supabase.from('survey_responses').select('*').order('created_at', { ascending: false }).limit(50);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const updateRoadmapPhase = async (id: string, updates: Partial<RoadmapPhase>) => {
      try {
          const { error } = await supabase.from('roadmap_phases').update(updates).eq('id', id);
          if (error) throw error;
          // Optimistic update
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

        {/* ... (Error and Overview Tabs omitted for brevity, keeping same structure) ... */}
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

        {/* ROADMAP TAB */}
        {activeTab === 'roadmap' && (
            <div className="animate-fade-in">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Roadmap Phases</h3>
                            <p className="text-sm text-slate-500">Manage launch dates and status for the landing page.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {roadmap.map((phase) => (
                            <div key={phase.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-500">
                                    {phase.order_index}
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <input 
                                            value={phase.title}
                                            onChange={e => updateRoadmapPhase(phase.id, { title: e.target.value })}
                                            className="font-bold text-slate-900 bg-transparent border-b border-slate-300 focus:border-blue-500 focus:outline-none w-full md:w-1/3"
                                            placeholder="Phase Title"
                                        />
                                        <input 
                                            value={phase.date_display}
                                            onChange={e => updateRoadmapPhase(phase.id, { date_display: e.target.value })}
                                            className="text-xs font-bold text-slate-500 uppercase bg-transparent border-b border-slate-300 focus:border-blue-500 focus:outline-none w-full md:w-1/4"
                                            placeholder="Display Date"
                                        />
                                    </div>
                                    <textarea 
                                        value={phase.description}
                                        onChange={e => updateRoadmapPhase(phase.id, { description: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none resize-none"
                                        rows={2}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                                    <select 
                                        value={phase.status}
                                        onChange={e => updateRoadmapPhase(phase.id, { status: e.target.value as any })}
                                        className={`w-full p-2 rounded-lg text-xs font-bold border cursor-pointer ${
                                            phase.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                                            phase.status === 'active' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            'bg-white text-slate-500 border-slate-200'
                                        }`}
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Existing tabs... */}
        {activeTab === 'waitlist' && (
          <div className="animate-fade-in">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {waitlist.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-400">No users found.</td></tr>
                    ) : (
                        waitlist.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-5 text-sm text-slate-400 font-mono">#{u.id}</td>
                            <td className="p-5 text-sm font-bold text-slate-900 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 text-[10px] text-white flex items-center justify-center font-bold">
                                   {u.email.charAt(0).toUpperCase()}
                                </div>
                                {u.email}
                            </td>
                            <td className="p-5"><span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">{u.source || 'Direct'}</span></td>
                            <td className="p-5 text-sm text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                        ))
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {/* PARTNERS TAB */}
        {activeTab === 'partners' && (
          <div className="animate-fade-in">
             <div className="grid grid-cols-1 gap-4">
                {partners.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">No partner applications yet.</div>
                ) : (
                    partners.map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6 group">
                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Store size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.pharmacy_name}</h3>
                                <div className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                                   <span className="font-medium text-slate-700">{p.owner_name}</span>
                                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                   <span>{p.phone}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {p.services && p.services.slice(0,3).map((s: string) => (
                                      <span key={s} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase">{s}</span>
                                  ))}
                                  {p.services && p.services.length > 3 && <span className="text-[10px] text-slate-400 self-center">+{p.services.length - 3} more</span>}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">New Application</span>
                                <span className="text-xs text-slate-400">{new Date(p.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex md:flex-col gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 items-center justify-center">
                            <button className="w-full md:w-auto px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors">Approve</button>
                            <button className="w-full md:w-auto px-4 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">Contact</button>
                        </div>
                    </div>
                    ))
                )}
             </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="animate-fade-in space-y-8">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Lists */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            onClick={() => setFeedbackView('surveys')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${feedbackView === 'surveys' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                          >
                            Surveys ({surveys.length})
                          </button>
                          <button 
                            onClick={() => setFeedbackView('notes')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${feedbackView === 'notes' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                          >
                            User Notes ({feedback.length})
                          </button>
                      </div>
                      <button onClick={runAiAnalysis} disabled={analyzing} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all active:scale-95 disabled:opacity-70">
                         {analyzing ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                         Run AI Analysis
                      </button>
                   </div>
                   
                   <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      {feedbackView === 'surveys' ? (
                        <div className="divide-y divide-slate-100">
                           {surveys.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm">No surveys received.</div> : surveys.map(s => (
                              <div key={s.id} className="p-6 hover:bg-slate-50 transition-colors">
                                 <div className="flex justify-between mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${s.role === 'CONSUMER' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{s.role}</span>
                                    <span className="text-xs text-slate-400">{new Date(s.created_at).toLocaleDateString()}</span>
                                 </div>
                                 <div className="grid grid-cols-2 gap-2 mb-3">
                                    {Object.entries(s.answers).map(([q, a]: [string, any]) => (
                                        q !== 'additional_comments' && (
                                            <div key={q} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">{q.replace(/_/g, ' ')}</div>
                                                <div className="text-sm font-medium text-slate-800">{String(a)}</div>
                                            </div>
                                        )
                                    ))}
                                 </div>
                                 {s.answers.additional_comments && (
                                     <div className="text-sm text-slate-600 italic border-l-2 border-slate-200 pl-3">"{s.answers.additional_comments}"</div>
                                 )}
                              </div>
                           ))}
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                           {feedback.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm">No feedback notes received.</div> : feedback.map(f => (
                              <div key={f.id} className="p-6 hover:bg-slate-50 transition-colors">
                                 <div className="flex justify-between mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${f.role === 'CONSUMER' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{f.role}</span>
                                    <span className="text-xs text-slate-400">{new Date(f.created_at).toLocaleDateString()}</span>
                                 </div>
                                 <p className="text-slate-800 text-sm leading-relaxed">{f.content}</p>
                              </div>
                           ))}
                        </div>
                      )}
                   </div>
                </div>

                {/* Right Panel: AI Results */}
                <div>
                   <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-8">
                      <div className="flex items-center gap-2 mb-6">
                         <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Sparkles size={20} /></div>
                         <h3 className="font-bold text-slate-900">Gemini Intelligence</h3>
                      </div>
                      
                      {!aiAnalysis ? (
                         <div className="text-center py-10">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                               <Sparkles size={32} />
                            </div>
                            <p className="text-sm text-slate-500 mb-4">Run analysis to get a summary of all user feedback and actionable insights.</p>
                            <button onClick={runAiAnalysis} disabled={analyzing} className="text-indigo-600 text-xs font-bold hover:underline">
                               {analyzing ? 'Analyzing...' : 'Start Analysis'}
                            </button>
                         </div>
                      ) : (
                         <div className="space-y-6 animate-fade-in">
                            <div>
                               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Executive Summary</h4>
                               <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">{aiAnalysis.executive_summary}</p>
                            </div>
                            
                            <div>
                               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Sentiment Breakdown</h4>
                               <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-2">
                                  <div style={{width: aiAnalysis.sentiment_breakdown?.positive || '33%'}} className="bg-emerald-500"></div>
                                  <div style={{width: aiAnalysis.sentiment_breakdown?.neutral || '33%'}} className="bg-slate-300"></div>
                                  <div style={{width: aiAnalysis.sentiment_breakdown?.negative || '33%'}} className="bg-red-500"></div>
                               </div>
                               <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                                  <span>Pos: {aiAnalysis.sentiment_breakdown?.positive}</span>
                                  <span>Neu: {aiAnalysis.sentiment_breakdown?.neutral}</span>
                                  <span>Neg: {aiAnalysis.sentiment_breakdown?.negative}</span>
                               </div>
                            </div>

                            <div>
                               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Top Themes</h4>
                               <div className="flex flex-wrap gap-2">
                                  {aiAnalysis.top_themes?.map((t: string, i: number) => (
                                     <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">{t}</span>
                                  ))}
                               </div>
                            </div>

                            <div>
                               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Recommended Features</h4>
                               <ul className="space-y-2">
                                  {aiAnalysis.recommended_features?.map((f: string, i: number) => (
                                     <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                        <Check size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>{f}</span>
                                     </li>
                                  ))}
                               </ul>
                            </div>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}
        
        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
            <div className="animate-fade-in space-y-8">
                
                {/* Automation Status Panel */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full animate-pulse">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Sunday Auto-Pilot</h3>
                            <p className="text-slate-500 text-sm">
                                Scheduled: <span className="font-mono font-bold text-slate-700">Every Sunday @ 09:00 AM</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Target: {metrics.waitlist.total + metrics.community.total} Subscribers</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleTestAutomation}
                            disabled={testingAutomation}
                            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg active:scale-95 disabled:opacity-70"
                        >
                            {testingAutomation ? <Loader2 className="animate-spin h-4 w-4" /> : <Play size={16} fill="currentColor" />}
                            {testingAutomation ? "Running API..." : "Test Trigger Now"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Generator Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Manual Generator</h3>
                                    <p className="text-slate-500 text-sm mt-1">If you want to send an update mid-week, use this AI tool.</p>
                                </div>
                                <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100 flex items-center gap-1">
                                    <Sparkles size={12} /> Gemini AI
                                </div>
                            </div>

                            {/* Data Sources */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                    <div className="text-2xl font-bold text-slate-900">{metrics.waitlist.total}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Waitlist</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                    <div className="text-2xl font-bold text-slate-900">{metrics.partners.total}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Partners</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                    <div className="text-2xl font-bold text-slate-900">{metrics.community.total}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Community</div>
                                </div>
                            </div>

                            {!newsletterDraft ? (
                                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                    <button 
                                        onClick={handleGenerateNewsletter} 
                                        disabled={generatingEmail}
                                        className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-70 flex items-center gap-2 mx-auto"
                                    >
                                        {generatingEmail ? <Loader2 className="animate-spin" /> : <PenLine className="h-5 w-5" />}
                                        {generatingEmail ? "AI is Writing..." : "Draft Manual Update"}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Subject Line</label>
                                        <input 
                                            value={newsletterDraft.subject}
                                            onChange={e => setNewsletterDraft({...newsletterDraft, subject: e.target.value})}
                                            className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Email Body</label>
                                        <textarea 
                                            value={newsletterDraft.body}
                                            onChange={e => setNewsletterDraft({...newsletterDraft, body: e.target.value})}
                                            className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-700 min-h-[200px] focus:border-blue-500 focus:outline-none leading-relaxed"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            onClick={handleSendNewsletter} 
                                            disabled={sendingEmail}
                                            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {sendingEmail ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                                            {sendingEmail ? "Broadcasting..." : "Broadcast Now"}
                                        </button>
                                        <button 
                                            onClick={() => setNewsletterDraft(null)}
                                            className="px-6 py-3 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50"
                                        >
                                            Discard
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* History Panel */}
                    <div>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Past Campaigns</h3>
                            <div className="space-y-4">
                                {pastCampaigns.length === 0 ? (
                                    <div className="text-slate-400 text-sm text-center py-4">No campaigns sent yet.</div>
                                ) : (
                                    pastCampaigns.map(c => (
                                        <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleDateString()}</div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${c.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-slate-200'}`}>
                                                    {c.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="font-bold text-slate-800 text-sm mb-1">{c.subject}</div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Users size={12} />
                                                <span>{c.recipient_count} recipients</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="animate-fade-in max-w-2xl">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">General Configuration</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">App Name</label>
                            <input 
                                type="text" 
                                value={settingsForm.app_name}
                                onChange={e => setSettingsForm({...settingsForm, app_name: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Logo URL</label>
                            <input 
                                type="text" 
                                value={settingsForm.logo_url}
                                onChange={e => setSettingsForm({...settingsForm, logo_url: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Contact Email</label>
                            <input 
                                type="email" 
                                value={settingsForm.contact_email}
                                onChange={e => setSettingsForm({...settingsForm, contact_email: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
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
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="w-24 text-xs font-bold text-slate-500">Instagram</span>
                                    <input 
                                        type="text" 
                                        value={settingsForm.instagram_url}
                                        onChange={e => setSettingsForm({...settingsForm, instagram_url: e.target.value})}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="w-24 text-xs font-bold text-slate-500">LinkedIn</span>
                                    <input 
                                        type="text" 
                                        value={settingsForm.linkedin_url}
                                        onChange={e => setSettingsForm({...settingsForm, linkedin_url: e.target.value})}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
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