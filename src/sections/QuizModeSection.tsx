import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, HelpCircle, RotateCcw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function QuizModeSection() {
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
      className="med-section-pinned bg-med-bg dark:bg-med-bg-dark med-pattern z-[70]"
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
              src="/quiz_writing.jpg" 
              alt="Student taking quiz"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content Card */}
          <div
            ref={rightCardRef}
            className="med-card p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-2
                     bg-gradient-to-br from-med-coral/5 to-transparent
                     border-med-coral/20"
          >
            {/* Pill */}
            <div 
              ref={pillRef}
              className="med-pill mb-6 w-fit"
            >
              <HelpCircle className="w-4 h-4 text-med-coral" />
              <span className="text-sm font-medium">Quiz</span>
            </div>

            <h2 className="font-heading font-bold text-3xl lg:text-4xl xl:text-5xl 
                         text-med-text dark:text-white leading-tight mb-6">
              Test yourself daily.
            </h2>
            <p className="text-base lg:text-lg text-med-text-secondary dark:text-gray-400 mb-8 max-w-md">
              Short, high-yield MCQs with explanations that teach—not just correct.
            </p>
            <div className="flex items-center gap-4">
              <button className="med-btn-primary flex items-center gap-2 bg-med-coral hover:bg-med-coral/90">
                <HelpCircle className="w-4 h-4" />
                Start a quiz
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="text-sm font-medium text-med-coral hover:underline flex items-center gap-1">
                <RotateCcw className="w-4 h-4" />
                Review mistakes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
