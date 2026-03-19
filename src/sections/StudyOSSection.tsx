import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HelpCircle, Layers, FileText, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function StudyOSSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const megaCardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const cardCRef = useRef<HTMLDivElement>(null);

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
        }
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(megaCardRef.current,
        { y: '10vh', opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(headerRef.current,
        { y: '-3vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(widgetRef.current,
        { x: '4vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.08
      );

      // Cards with stagger
      scrollTl.fromTo(cardARef.current,
        { y: '12vh', opacity: 0, rotate: -1 },
        { y: 0, opacity: 1, rotate: 0, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(cardBRef.current,
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.14
      );

      scrollTl.fromTo(cardCRef.current,
        { y: '12vh', opacity: 0, rotate: 1 },
        { y: 0, opacity: 1, rotate: 0, ease: 'none' },
        0.18
      );

      // SETTLE (30-70%): Hold positions

      // EXIT (70-100%)
      scrollTl.fromTo(cardARef.current,
        { x: 0, opacity: 1 },
        { x: '-6vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(cardBRef.current,
        { y: 0, opacity: 1 },
        { y: '-4vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(cardCRef.current,
        { x: 0, opacity: 1 },
        { x: '6vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo([headerRef.current, widgetRef.current],
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(megaCardRef.current,
        { y: 0, opacity: 1 },
        { y: '-8vh', opacity: 0, ease: 'power2.in' },
        0.75
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      ref: cardARef,
      icon: HelpCircle,
      title: 'Quiz Mode',
      description: 'MCQs with instant explanations and spaced repetition.',
      accent: 'bg-med-coral',
      iconBg: 'bg-med-coral/10',
      iconColor: 'text-med-coral',
    },
    {
      ref: cardBRef,
      icon: Layers,
      title: 'Flashcards',
      description: 'Memorize drugs, anatomy, and protocols—fast.',
      accent: 'bg-med-mint',
      iconBg: 'bg-med-mint/10',
      iconColor: 'text-med-mint',
    },
    {
      ref: cardCRef,
      icon: FileText,
      title: 'Smart Notes',
      description: 'Searchable, taggable, always in sync.',
      accent: 'bg-med-lavender',
      iconBg: 'bg-med-lavender/10',
      iconColor: 'text-med-lavender',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="features"
      className="med-section-pinned bg-med-bg dark:bg-med-bg-dark med-pattern z-20"
    >
      <div 
        ref={megaCardRef}
        className="relative w-[92vw] h-[80vh] med-mega-card p-6 lg:p-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 
            ref={headerRef}
            className="font-heading font-bold text-2xl lg:text-4xl text-med-text dark:text-white"
          >
            Study your way.
          </h2>
          <div 
            ref={widgetRef}
            className="med-card px-4 py-2 flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-med-mint animate-pulse" />
            <span className="text-sm text-med-text-secondary">Daily goal: 45 min</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-[calc(100%-100px)]">
          {features.map((feature) => (
            <div
              key={feature.title}
              ref={feature.ref}
              className="med-card p-6 lg:p-8 flex flex-col hover:shadow-card-hover 
                       transition-shadow duration-300 group cursor-pointer"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="font-heading font-bold text-xl lg:text-2xl text-med-text dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-med-text-secondary dark:text-gray-400 flex-1">
                {feature.description}
              </p>

              {/* Action Button */}
              <button className={`mt-6 w-10 h-10 rounded-full ${feature.iconBg} 
                               flex items-center justify-center
                               group-hover:scale-110 transition-transform`}>
                <ArrowRight className={`w-4 h-4 ${feature.iconColor}`} />
              </button>

              {/* Accent Bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${feature.accent} 
                            rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
