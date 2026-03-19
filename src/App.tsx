import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import StudyOSSection from './sections/StudyOSSection';
import CommunitySection from './sections/CommunitySection';
import AITutorSection from './sections/AITutorSection';
import RevisionHubSection from './sections/RevisionHubSection';
import AnalyticsSection from './sections/AnalyticsSection';
import QuizModeSection from './sections/QuizModeSection';
import FlashcardsSection from './sections/FlashcardsSection';
import DiscussionsSection from './sections/DiscussionsSection';
import LibrarySection from './sections/LibrarySection';
import CountdownSection from './sections/CountdownSection';
import TelegramSection from './sections/TelegramSection';
import TestimonialsSection from './sections/TestimonialsSection';
import FinalCTASection from './sections/FinalCTASection';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import AuthPanel from './components/AuthPanel';
import './App.css';
import { apiFetch } from './lib/api';
import type { UserProfile } from './types/api';

gsap.registerPlugin(ScrollTrigger);

type CurrentView = 'landing' | 'auth' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('landing');
  const [showAI, setShowAI] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [booting, setBooting] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('medstudy_token');
    if (!token) {
      setBooting(false);
      return;
    }

    apiFetch<{ user: UserProfile }>('/api/auth/me')
      .then((response) => {
        setCurrentUser(response.user);
        setCurrentView('dashboard');
      })
      .catch(() => {
        localStorage.removeItem('medstudy_token');
      })
      .finally(() => setBooting(false));
  }, []);

  useEffect(() => {
    if (currentView === 'landing') {
      const initSnap = () => {
        const pinned = ScrollTrigger.getAll()
          .filter((st) => st.vars.pin)
          .sort((a, b) => a.start - b.start);

        const maxScroll = ScrollTrigger.maxScroll(window);
        if (!maxScroll || pinned.length === 0) return;

        const pinnedRanges = pinned.map((st) => ({
          start: st.start / maxScroll,
          end: (st.end ?? st.start) / maxScroll,
          center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
        }));

        ScrollTrigger.create({
          snap: {
            snapTo: (value: number) => {
              const inPinned = pinnedRanges.some((r) => value >= r.start - 0.02 && value <= r.end + 0.02);
              if (!inPinned) return value;

              return pinnedRanges.reduce(
                (closest, r) => (Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest),
                pinnedRanges[0]?.center ?? 0
              );
            },
            duration: { min: 0.15, max: 0.35 },
            delay: 0,
            ease: 'power2.out',
          },
        });
      };

      const timer = setTimeout(initSnap, 500);
      return () => {
        clearTimeout(timer);
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    }
  }, [currentView]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navigateToDashboard = () => {
    setCurrentView(currentUser ? 'dashboard' : 'auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticated = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('medstudy_token');
    setCurrentUser(null);
    setCurrentView('landing');
  };

  if (booting) {
    return <div className={`min-h-screen ${isDarkMode ? 'dark bg-med-bg-dark' : 'bg-med-bg'}`} />;
  }

  if (currentView === 'auth') {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <Navigation
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onLogoClick={navigateToLanding}
          currentView="landing"
        />
        <AuthPanel isDarkMode={isDarkMode} onAuthenticated={handleAuthenticated} />
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <Navigation
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onLogoClick={navigateToLanding}
          onDashboardClick={navigateToDashboard}
          currentView="dashboard"
        />
        <Dashboard isDarkMode={isDarkMode} onOpenAI={() => setShowAI(true)} currentUser={currentUser} onLogout={handleLogout} />
        <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div ref={mainRef} className={`relative ${isDarkMode ? 'dark' : ''}`}>
      <Navigation
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onLogoClick={navigateToLanding}
        onDashboardClick={navigateToDashboard}
        onGetStarted={navigateToDashboard}
        currentView="landing"
      />

      <main className="relative">
        <HeroSection onGetStarted={navigateToDashboard} />
        <StudyOSSection />
        <CommunitySection />
        <AITutorSection onTryAI={() => setShowAI(true)} />
        <RevisionHubSection />
        <AnalyticsSection />
        <QuizModeSection />
        <FlashcardsSection />
        <DiscussionsSection />
        <LibrarySection />
        <CountdownSection />
        <TelegramSection />
        <TestimonialsSection />
        <FinalCTASection onGetStarted={navigateToDashboard} />
      </main>

      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} isDarkMode={isDarkMode} />

      <button
        onClick={() => setShowAI(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-med-teal text-white rounded-full shadow-lg flex items-center justify-center hover:bg-med-teal/90 transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Open AI Assistant"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </button>
    </div>
  );
}

export default App;
