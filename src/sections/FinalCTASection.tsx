import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FinalCTASectionProps {
  onGetStarted?: () => void;
}

export default function FinalCTASection({ onGetStarted }: FinalCTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 60, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      gsap.fromTo(buttonRef.current,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          delay: 0.2,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="pricing"
      className="relative bg-med-bg-dark py-20 lg:py-32 z-[140]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 med-pattern" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div 
          ref={cardRef}
          className="med-mega-card p-8 lg:p-16 text-center"
        >
          <h2 className="font-heading font-bold text-3xl lg:text-4xl xl:text-5xl 
                       text-med-text dark:text-white mb-4">
            Ready to ace your next exam?
          </h2>
          <p className="text-base lg:text-lg text-med-text-secondary dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of Kenyan medical students studying smarter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              ref={buttonRef}
              onClick={onGetStarted}
              className="med-btn-primary flex items-center gap-2 text-base px-8 py-4"
            >
              Create free account
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 text-med-text-secondary hover:text-med-text transition-colors">
              <Mail className="w-4 h-4" />
              Contact us
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/10">
            <p className="text-sm text-med-text-secondary mb-4">
              Trusted by students from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-med-text-secondary">
              <span>University of Nairobi</span>
              <span className="w-1 h-1 rounded-full bg-med-text-secondary/30" />
              <span>Kenyatta University</span>
              <span className="w-1 h-1 rounded-full bg-med-text-secondary/30" />
              <span>Moi University</span>
              <span className="w-1 h-1 rounded-full bg-med-text-secondary/30" />
              <span>JKUAT</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-med-teal flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-heading font-bold text-lg text-white">MedStudy</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2026 MedStudy Kenya. Built for medical students, by medical students.
          </p>
        </footer>
      </div>
    </section>
  );
}
