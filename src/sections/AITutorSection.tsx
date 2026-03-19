import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AITutorSectionProps {
  onTryAI?: () => void;
}

export default function AITutorSection({ onTryAI }: AITutorSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const megaCardRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

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
      scrollTl.fromTo(leftCardRef.current,
        { x: '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(rightCardRef.current,
        { x: '50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(pillRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0.1
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.fromTo(leftCardRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(rightCardRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(pillRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.8
      );

      scrollTl.fromTo(megaCardRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.85
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="med-section-pinned bg-med-bg dark:bg-med-bg-dark med-pattern z-40"
    >
      <div 
        ref={megaCardRef}
        className="relative w-[92vw] h-[80vh] med-mega-card p-6 lg:p-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Image Card */}
          <div
            ref={leftCardRef}
            className="relative rounded-2xl overflow-hidden order-2 lg:order-1"
          >
            <img 
              src="/ai_tutor_student.jpg" 
              alt="Student studying with AI"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content Card */}
          <div
            ref={rightCardRef}
            className="med-card p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-2
                     bg-gradient-to-br from-med-lavender/5 to-transparent
                     border-med-lavender/20"
          >
            {/* Pill */}
            <div 
              ref={pillRef}
              className="med-pill mb-6 w-fit"
            >
              <MessageSquare className="w-4 h-4 text-med-lavender" />
              <span className="text-sm font-medium">Ask</span>
            </div>

            <h2 className="font-heading font-bold text-3xl lg:text-4xl xl:text-5xl 
                         text-med-text dark:text-white leading-tight mb-6">
              Ask. Learn. Repeat.
            </h2>
            <p className="text-base lg:text-lg text-med-text-secondary dark:text-gray-400 mb-8 max-w-md">
              Get explanations, mnemonics, and practice questions tailored to your weak areas.
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={onTryAI}
                className="med-btn-primary flex items-center gap-2 bg-med-lavender hover:bg-med-lavender/90"
              >
                <Sparkles className="w-4 h-4" />
                Try a question
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-med-text-secondary mt-6">
              AI-generated content is reviewed for accuracy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
