
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import * as ReactRouterDOM from 'react-router-dom';
import { 
  LayoutDashboard, Users, Store, MessageSquare, Settings, 
  LogOut, TrendingUp, Sparkles, Loader2, Save, ExternalLink, AlertTriangle,
  ChevronRight, Search, Bell, Check, X, Info, ClipboardList, PenLine, Mail, Send,
  Zap, Clock, Play, Map, Key, Download, FileText, Printer
} from 'lucide-react';
import { useAppConfig } from '../context/AppContext';
import { analyzeBatchFeedback, generateNewsletter } from '../services/geminiService';
import { AdminStats, AppConfig, RoadmapPhase } from '../types';

const { useNavigate } = ReactRouterDOM as any;

type Tab = 'overview' | 'waitlist' | 'partners' | 'feedback' | 'campaigns' | 'roadmap' | 'settings';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { config, refreshConfig } = useAppConfig();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  
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
    
    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_notifications' }, (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'roadmap_phases' }, () => {
           fetchRoadmap(); 
      })
      .subscribe();
    
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
    try {
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

      const { data: campaignData } = await supabase.from('newsletter_campaigns').select('*').order('created_at', { ascending: false });
      if (campaignData) setPastCampaigns(campaignData);

    } catch (e: any) {
      console.error("Error fetching admin data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
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

          if (error) throw error;
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

  const handleTestAutomation = async () => {
    setTestingAutomation(true);
    try {
      const response = await fetch('/api/trigger-automation', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'API Error');
      alert(`Status: ${data.message}\n${data.generated_content?.subject ? `Generated: ${data.generated_content.subject}` : ''}`);
      const { data: cData } = await supabase.from('newsletter_campaigns').select('*').order('created_at', { ascending: false });
      if (cData) setPastCampaigns(cData);
    } catch (e: any) {
      alert("Automation Error: " + e.message);
    } finally {
      setTestingAutomation(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
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

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900">
      <aside className="w-72 bg-[#0f172a] fixed h-full overflow-y-auto z-30 border-r border-slate-800 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">M</div>
             <h1 className="text-xl font-bold text-white tracking-tight">Medzo Admin</h1>
          </div>
          <p className="text-xs text-slate-500 ml-11">Version 1.0.6</p>
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

      <main className="ml-72 flex-1 p-8 lg:p-12">
        <div className="flex justify-between items-center mb-10">
           <div>
              <h2 className="text-3xl font-bold text-slate-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
              <p className="text-slate-500 mt-1">Manage your application data and settings.</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative" ref={notifRef}>
                  <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 shadow-sm transition-all">
                    <Bell size={18} />
                  </button>
              </div>
           </div>
        </div>

        {activeTab === 'overview' && (
            <div className="grid grid-cols-4 gap-6 animate-fade-in">
                {[{l:'Waitlist', v: metrics.waitlist.total}, {l:'Partners', v: metrics.partners.total}, {l:'Community', v: metrics.community.total}, {l:'Feedback', v: metrics.feedback.total}].map((m, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="text-sm text-slate-500 mb-1">{m.l}</div>
                        <div className="text-3xl font-bold text-slate-900">{m.v}</div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'waitlist' && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-slate-100"><h3 className="font-bold">Waitlist Users</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase"><tr><th className="p-4">Email</th><th className="p-4">Source</th><th className="p-4">Date</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {waitlist.map(u => (
                                <tr key={u.id}><td className="p-4 font-bold text-slate-700">{u.email}</td><td className="p-4 text-sm text-slate-500">{u.source || 'Direct'}</td><td className="p-4 text-sm text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'partners' && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-slate-100"><h3 className="font-bold">Partner Applications</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase"><tr><th className="p-4">Pharmacy</th><th className="p-4">Owner</th><th className="p-4">Phone</th><th className="p-4">License</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {partners.map(p => (
                                <tr key={p.id}><td className="p-4 font-bold text-slate-700">{p.pharmacy_name}</td><td className="p-4 text-sm">{p.owner_name}</td><td className="p-4 text-sm">{p.phone}</td><td className="p-4 text-sm font-mono">{p.license_no}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'roadmap' && (
            <div className="space-y-4 animate-fade-in">
                {roadmap.map(phase => (
                    <div key={phase.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-slate-900">{phase.title}</div>
                            <div className="text-sm text-slate-500">{phase.description}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${phase.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{phase.status}</span>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'feedback' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex gap-4 mb-4">
                    <button onClick={() => setFeedbackView('surveys')} className={`px-4 py-2 rounded-xl text-sm font-bold ${feedbackView==='surveys' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>Surveys</button>
                    <button onClick={() => setFeedbackView('notes')} className={`px-4 py-2 rounded-xl text-sm font-bold ${feedbackView==='notes' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>Notes</button>
                </div>
                {feedbackView === 'notes' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feedback.map(f => (
                            <div key={f.id} className="bg-white p-6 rounded-2xl border border-slate-200">
                                <div className="text-sm font-bold text-slate-900 mb-2">{f.role} Note</div>
                                <p className="text-slate-600 text-sm">{f.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h4 className="font-bold mb-4">Recent Survey Responses</h4>
                        <div className="space-y-4">
                            {surveys.map(s => (
                                <div key={s.id} className="border-b border-slate-100 pb-4 last:border-0">
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-1">{s.role}</div>
                                    <pre className="text-xs bg-slate-50 p-2 rounded text-slate-700 overflow-x-auto">{JSON.stringify(s.answers, null, 2)}</pre>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                   <div className="flex items-center gap-3 mb-6">
                       <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><Sparkles size={24}/></div>
                       <h3 className="text-xl font-bold text-slate-900">AI Newsletter Pilot</h3>
                   </div>
                   <p className="text-slate-500 mb-6">Generate and send weekly updates to the waitlist automatically.</p>
                   <button onClick={handleGenerateNewsletter} disabled={generatingEmail} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg disabled:opacity-70 flex justify-center gap-2 items-center">
                     {generatingEmail ? <Loader2 className="animate-spin"/> : <Zap size={18}/>} Generate Update
                   </button>
                   <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                      <button onClick={handleTestAutomation} disabled={testingAutomation} className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 w-full">
                         {testingAutomation ? <Loader2 className="animate-spin w-3 h-3"/> : <Play size={12}/>} Test Trigger Automation (Backend Vercel)
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
                               <input value={newsletterDraft.subject} onChange={e => setNewsletterDraft({...newsletterDraft, subject: e.target.value})} className="w-full font-bold text-lg text-slate-900 border-b border-slate-200 pb-2 focus:outline-none focus:border-indigo-500" />
                           </div>
                           <div className="mb-6">
                               <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Body Content</label>
                               <textarea value={newsletterDraft.body} onChange={e => setNewsletterDraft({...newsletterDraft, body: e.target.value})} className="w-full h-48 text-slate-900 text-sm leading-relaxed border border-slate-100 rounded-xl p-3 focus:outline-none focus:border-indigo-500 resize-none" />
                           </div>
                           <button onClick={handleSendNewsletter} disabled={sendingEmail} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 flex justify-center items-center gap-2">
                               {sendingEmail ? <Loader2 className="animate-spin"/> : <Send size={18}/>} Send to {metrics.waitlist.total + metrics.community.total} Users
                           </button>
                       </div>
                    </div>
                )}
             </div>
             <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden h-fit">
                 <div className="p-6 border-b border-slate-100"><h3 className="font-bold text-slate-900">Campaign History</h3></div>
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

        {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 animate-fade-in max-w-2xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Global App Settings</h3>
                <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">App Name</label><input value={settingsForm.app_name} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Email</label><input value={settingsForm.contact_email} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" /></div>
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm">Save Changes</button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
