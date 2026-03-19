import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CommunitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const megaCardRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

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
        { x: '-50vw', opacity: 0, rotate: -2 },
        { x: 0, opacity: 1, rotate: 0, ease: 'none' },
        0
      );

      scrollTl.fromTo(rightCardRef.current,
        { x: '50vw', opacity: 0, scale: 1.03 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(badgeRef.current,
        { y: '-4vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
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

      scrollTl.fromTo(badgeRef.current,
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
      id="community"
      className="med-section-pinned bg-med-bg dark:bg-med-bg-dark med-pattern z-30"
    >
      <div 
        ref={megaCardRef}
        className="relative w-[92vw] h-[80vh] med-mega-card p-6 lg:p-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Content Card */}
          <div
            ref={leftCardRef}
            className="med-card p-8 lg:p-12 flex flex-col justify-center
                     bg-gradient-to-br from-med-teal/5 to-transparent
                     border-med-teal/20"
          >
            <h2 className="font-heading font-bold text-3xl lg:text-4xl xl:text-5xl 
                         text-med-text dark:text-white leading-tight mb-6">
              Community that keeps you going.
            </h2>
            <p className="text-base lg:text-lg text-med-text-secondary dark:text-gray-400 mb-8 max-w-md">
              Join subject rooms, ask anonymously, and get answers from students across Kenya.
            </p>
            <div className="flex items-center gap-4">
              <button className="med-btn-primary flex items-center gap-2">
                Join a room
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="text-sm font-medium text-med-teal hover:underline">
                Browse topics
              </button>
            </div>
          </div>

          {/* Right Image Card */}
          <div
            ref={rightCardRef}
            className="relative rounded-2xl overflow-hidden"
          >
            <img 
              src="/community_group.jpg" 
              alt="Students studying together"
              className="w-full h-full object-cover"
            />
            
            {/* Badge Pill */}
            <div 
              ref={badgeRef}
              className="absolute top-6 right-6 med-pill bg-white/90 backdrop-blur-sm"
            >
              <Users className="w-4 h-4 text-med-teal" />
              <span className="text-sm font-medium">Active now: 842</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
