import { useEffect, useMemo, useState } from 'react';
import {
  Home, BookOpen, MessageCircle, Users, Settings,
  TrendingUp, Clock, Target,
  HelpCircle, Layers, Calendar, Zap,
  ChevronRight, Flame, LogOut, Loader2, MessageSquarePlus
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { apiFetch } from '@/lib/api';
import type { DashboardResponse, UserProfile } from '@/types/api';

interface DashboardProps {
  isDarkMode: boolean;
  onOpenAI: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export default function Dashboard({ isDarkMode, onOpenAI, currentUser, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [telegramLink, setTelegramLink] = useState<string>('');
  const [telegramLoading, setTelegramLoading] = useState(false);

  useEffect(() => {
    apiFetch<DashboardResponse>('/api/dashboard')
      .then((response) => setData(response))
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'study', icon: BookOpen, label: 'Study' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', badge: data?.recentDiscussions.length ? 3 : undefined },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const quickActions = [
    { icon: HelpCircle, label: 'Start Quiz', color: 'bg-med-coral/10 text-med-coral', onClick: () => setActiveTab('study') },
    { icon: Layers, label: 'Flashcards', color: 'bg-med-mint/10 text-med-mint', onClick: () => setActiveTab('study') },
    { icon: MessageSquarePlus, label: 'Telegram', color: 'bg-med-lavender/10 text-med-lavender', onClick: async () => {
      setTelegramLoading(true);
      try {
        const response = await apiFetch<{ deepLink: string }>('/api/telegram/link-code', { method: 'POST', body: JSON.stringify({}) });
        setTelegramLink(response.deepLink);
      } finally {
        setTelegramLoading(false);
      }
    } },
    { icon: Zap, label: 'AI Tutor', color: 'bg-med-sky/10 text-med-sky', onClick: onOpenAI },
  ];

  const goalPercent = useMemo(() => {
    if (!data) return 0;
    return Math.round((data.summary.todayMinutes / data.summary.dailyGoalMinutes) * 100);
  }, [data]);

  if (loading) {
    return (
      <div className={`min-h-screen pt-24 flex items-center justify-center ${isDarkMode ? 'bg-med-bg-dark' : 'bg-med-bg'}`}>
        <Loader2 className="w-8 h-8 animate-spin text-med-teal" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen pt-24 px-4 ${isDarkMode ? 'bg-med-bg-dark' : 'bg-med-bg'}`}>
        <div className="max-w-2xl mx-auto med-card p-8">
          <h2 className="font-heading text-2xl font-bold text-med-text dark:text-white mb-2">Dashboard could not load</h2>
          <p className="text-med-text-secondary mb-4">{error || 'Unknown error.'}</p>
          <button className="med-btn-primary" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-med-bg-dark' : 'bg-med-bg'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 hidden lg:block">
            <div className="med-card p-4 sticky top-24">
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${activeTab === item.id ? 'bg-med-teal/10 text-med-teal' : 'text-med-text-secondary hover:bg-gray-100 dark:hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && <span className="w-5 h-5 rounded-full bg-med-coral text-white text-xs flex items-center justify-center">{item.badge}</span>}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-med-coral" />
                  <span className="font-medium text-med-text dark:text-white">{data.summary.studyStreak} day streak</span>
                </div>
                <p className="text-xs text-med-text-secondary">Keep it up! You're on fire!</p>
              </div>

              <button onClick={onLogout} className="mt-6 w-full px-4 py-3 rounded-xl text-sm bg-gray-100 dark:bg-white/5 text-med-text dark:text-white flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="med-card p-6 bg-gradient-to-br from-med-teal/5 to-transparent border-med-teal/20">
              <h1 className="font-heading font-bold text-2xl text-med-text dark:text-white mb-2">Good day, {data.user.name || currentUser?.name || 'Student'}! 👋</h1>
              <p className="text-med-text-secondary">You have {data.summary.pendingQuizzes} quizzes pending and {data.summary.flashcardsToReview} flashcards to review today.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <button key={action.label} onClick={action.onClick} className="med-card p-4 flex flex-col items-center gap-2 hover:shadow-card-hover transition-shadow">
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-med-text dark:text-white text-center">{action.label}</span>
                </button>
              ))}
            </div>

            {telegramLoading && <p className="text-sm text-med-text-secondary">Generating Telegram link…</p>}
            {telegramLink && <a href={telegramLink} target="_blank" rel="noreferrer" className="inline-flex text-sm text-med-teal hover:underline">Open Telegram bot link</a>}

            <div className="med-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-lg text-med-text dark:text-white">Your Progress</h2>
                <button className="text-sm text-med-teal hover:underline">Live data</button>
              </div>
              <div className="space-y-4">
                {data.subjects.map((subject) => (
                  <div key={subject.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-med-text dark:text-white">{subject.name}</span>
                      <span className="text-sm text-med-text-secondary">{subject.completed}/{subject.total} topics</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="med-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-lg text-med-text dark:text-white">Recent Discussions</h2>
                <button className="text-sm text-med-teal hover:underline">View all</button>
              </div>
              <div className="space-y-4">
                {data.recentDiscussions.map((discussion) => (
                  <div key={discussion.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-med-teal/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-med-teal">{discussion.author.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-med-text dark:text-white truncate">{discussion.title}</h3>
                      <p className="text-sm text-med-text-secondary">{discussion.replies} replies • {new Date(discussion.time).toLocaleString()}</p>
                      <p className="text-sm text-med-text-secondary truncate">{discussion.excerpt}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-med-text-secondary flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="med-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-med-teal" />
                <h3 className="font-medium text-med-text dark:text-white">Daily Goal</h3>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-white/10" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(goalPercent / 100) * 251} 251`} className="text-med-teal" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold text-med-text dark:text-white">{goalPercent}%</span></div>
                </div>
                <p className="text-sm text-med-text-secondary">{data.summary.todayMinutes} of {data.summary.dailyGoalMinutes} minutes</p>
              </div>
            </div>

            <div className="med-card p-6">
              <h3 className="font-medium text-med-text dark:text-white mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-med-sky/10 flex items-center justify-center"><Clock className="w-5 h-5 text-med-sky" /></div><div><p className="text-lg font-bold text-med-text dark:text-white">{data.stats.weeklyStudyHours} hrs</p><p className="text-xs text-med-text-secondary">Study time</p></div></div>
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-med-coral/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-med-coral" /></div><div><p className="text-lg font-bold text-med-text dark:text-white">{data.stats.quizAccuracy}%</p><p className="text-xs text-med-text-secondary">Quiz accuracy</p></div></div>
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-med-lavender/10 flex items-center justify-center"><HelpCircle className="w-5 h-5 text-med-lavender" /></div><div><p className="text-lg font-bold text-med-text dark:text-white">{data.stats.questionsAnswered}</p><p className="text-xs text-med-text-secondary">Questions answered</p></div></div>
              </div>
            </div>

            <div className="med-card p-6">
              <div className="flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-med-cream" /><h3 className="font-medium text-med-text dark:text-white">Upcoming</h3></div>
              <div className="space-y-3">
                {data.upcoming.map((item) => (
                  <div key={item.title} className="p-3 rounded-xl bg-med-coral/5 border border-med-coral/10">
                    <p className="text-sm font-medium text-med-text dark:text-white">{item.title}</p>
                    <p className="text-xs text-med-text-secondary">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
