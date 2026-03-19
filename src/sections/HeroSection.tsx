import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home, BookOpen, MessageCircle, Users, Settings, Search, Bell, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const megaCardRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Mega card entrance
      tl.fromTo(megaCardRef.current,
        { opacity: 0, y: '6vh', scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 }
      );

      // Sidebar entrance
      tl.fromTo(sidebarRef.current,
        { x: '-4vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6 },
        '-=0.5'
      );

      // Headline lines
      const headlineLines = headlineRef.current?.querySelectorAll('.headline-line');
      if (headlineLines) {
        tl.fromTo(headlineLines,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
          '-=0.3'
        );
      }

      // Image card
      tl.fromTo(imageCardRef.current,
        { x: '6vw', opacity: 0, scale: 1.02 },
        { x: 0, opacity: 1, scale: 1, duration: 0.7 },
        '-=0.5'
      );

      // Stats
      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems) {
        tl.fromTo(statItems,
          { y: '3vh', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
          '-=0.3'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([megaCardRef.current, sidebarRef.current, imageCardRef.current], {
              opacity: 1, x: 0, y: 0, scale: 1
            });
            const headlineLines = headlineRef.current?.querySelectorAll('.headline-line');
            if (headlineLines && headlineLines.length > 0) {
              gsap.set(headlineLines, { opacity: 1, y: 0 });
            }
          }
        }
      });

      // ENTRANCE (0-30%): Hold (already animated on load)
      // SETTLE (30-70%): Hold
      // EXIT (70-100%)
      scrollTl.fromTo(megaCardRef.current,
        { y: 0, scale: 1, opacity: 1 },
        { y: '-10vh', scale: 0.96, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(imageCardRef.current,
        { x: 0, opacity: 1 },
        { x: '-4vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const sidebarItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: BookOpen, label: 'Study' },
    { icon: MessageCircle, label: 'Messages' },
    { icon: Users, label: 'Community' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <section 
      ref={sectionRef}
      className="med-section-pinned bg-med-bg dark:bg-med-bg-dark med-pattern z-10"
    >
      {/* Mega Card Container */}
      <div 
        ref={megaCardRef}
        className="relative w-[92vw] h-[80vh] med-mega-card overflow-hidden"
      >
        {/* Left Sidebar */}
        <div 
          ref={sidebarRef}
          className="absolute left-0 top-0 w-[22%] h-full bg-gray-50 dark:bg-white/5 
                     border-r border-[rgba(16,24,32,0.08)] dark:border-white/10 p-4 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-med-teal flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-heading font-semibold text-sm">MedStudy</span>
          </div>

          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                          transition-colors ${
                            item.active 
                              ? 'bg-med-teal/10 text-med-teal' 
                              : 'text-med-text-secondary hover:bg-gray-100 dark:hover:bg-white/5'
                          }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Top Nav */}
        <div className="absolute left-[22%] top-0 right-0 h-[10%] bg-white dark:bg-transparent
                        border-b border-[rgba(16,24,32,0.08)] dark:border-white/10
                        flex items-center justify-between px-6">
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/5 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-med-text-secondary" />
            <span className="text-sm text-med-text-secondary">Search topics, questions...</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-full bg-med-teal/20 flex items-center justify-center">
              <span className="text-sm font-medium text-med-teal">JD</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="absolute left-[22%] top-[10%] right-0 bottom-0 p-6 lg:p-10">
          {/* Headline Block */}
          <div ref={headlineRef} className="max-w-[52%]">
            <h1 className="font-heading font-bold text-3xl lg:text-5xl xl:text-6xl 
                         text-med-text dark:text-white leading-[0.95] tracking-tight mb-4">
              <span className="headline-line block">Your medical study</span>
              <span className="headline-line block">command center.</span>
            </h1>
            <p className="headline-line text-base lg:text-lg text-med-text-secondary 
                        dark:text-gray-400 max-w-md">
              Notes, quizzes, discussions, and AI tutoring—built for Kenyan medical students.
            </p>

            {/* CTA Row */}
            <div className="flex items-center gap-4 mt-8">
              <button 
                onClick={onGetStarted}
                className="med-btn-primary flex items-center gap-2"
              >
                Start free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="med-btn-secondary">
                Explore features
              </button>
            </div>
          </div>

          {/* Hero Image Card */}
          <div 
            ref={imageCardRef}
            className="absolute right-6 lg:right-10 top-6 lg:top-10 
                     w-[34%] h-[56%] rounded-2xl overflow-hidden"
          >
            <img 
              src="/hero_student.jpg" 
              alt="Medical student"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mini Stat Cards */}
          <div 
            ref={statsRef}
            className="absolute right-6 lg:right-10 bottom-6 lg:bottom-8
                     w-[34%] h-[16%] bg-white dark:bg-white/5 
                     rounded-2xl border border-[rgba(16,24,32,0.08)] dark:border-white/10
                     flex divide-x divide-gray-100 dark:divide-white/10"
          >
            <div className="stat-item flex-1 flex flex-col items-center justify-center p-4">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-med-teal">12K+</span>
              <span className="text-xs text-med-text-secondary mt-1">Students</span>
            </div>
            <div className="stat-item flex-1 flex flex-col items-center justify-center p-4">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-med-lavender">340</span>
              <span className="text-xs text-med-text-secondary mt-1">Topics</span>
            </div>
            <div className="stat-item flex-1 flex flex-col items-center justify-center p-4">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-med-coral">24/7</span>
              <span className="text-xs text-med-text-secondary mt-1">Q&amp;A</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
