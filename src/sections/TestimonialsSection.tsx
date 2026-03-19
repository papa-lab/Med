import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Cards animation with stagger
      const cards = cardsRef.current?.querySelectorAll('.testimonial-card');
      if (cards) {
        gsap.fromTo(cards,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const testimonials = [
    {
      quote: "The quizzes feel like the real exam. The explanations are gold.",
      name: "A.O.",
      university: "University of Nairobi",
      avatar: "AO",
      color: "bg-med-teal",
    },
    {
      quote: "I finally have a place to ask 'dumb' questions without judgment.",
      name: "C.K.",
      university: "Kenyatta University",
      avatar: "CK",
      color: "bg-med-lavender",
    },
    {
      quote: "Flashcards + Telegram reminders keep me consistent.",
      name: "J.M.",
      university: "Moi University",
      avatar: "JM",
      color: "bg-med-coral",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-med-bg dark:bg-med-bg-dark med-pattern py-20 lg:py-32 z-[130]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 lg:mb-16">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl xl:text-5xl 
                       text-med-text dark:text-white mb-4">
            Loved by students.
          </h2>
          <p className="text-base lg:text-lg text-med-text-secondary dark:text-gray-400 max-w-xl mx-auto">
            From Nairobi to Mombasa, students are studying smarter.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="testimonial-card med-card p-6 lg:p-8 hover:shadow-card-hover 
                       transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-med-teal/30 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-med-cream text-med-cream" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-med-text dark:text-white mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center`}>
                  <span className="text-white text-sm font-medium">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-med-text dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-med-text-secondary">{testimonial.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
