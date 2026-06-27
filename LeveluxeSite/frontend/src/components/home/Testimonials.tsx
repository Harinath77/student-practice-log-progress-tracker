import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: "Ananya Rao",
      course: "Piano (Beginner)",
      rating: 5,
      feedback: "The piano curriculum here is structured yet extremely fun. My instructor is incredibly patient and helps me learn at my own pace. The acoustic stage performances have completely transformed my confidence!",
      initials: "AR",
      color: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
    },
    {
      name: "Rohit Reddy",
      course: "Electric Guitar (Intermediate)",
      rating: 5,
      feedback: "Leveluxe has the best soundproof jam rooms and professional setups. Playing in the academy's seasonal rock band showcase was a huge highlight. Instructors here are real performers who know their craft.",
      initials: "RR",
      color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
    },
    {
      name: "Sarah Khan",
      course: "Vocal Training (Beginner)",
      rating: 5,
      feedback: "I joined to fix my breathing technique and scale alignment. The voice exercises taught here are scientific and easy to grasp. In just four months, my vocal range has improved significantly!",
      initials: "SK",
      color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    }
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full py-20 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="text-left space-y-4 max-w-2xl">
            <span className="text-indigo-400 font-bold text-xs tracking-widest uppercase">
              Student Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Loved by Our Students
            </h2>
            <p className="text-neutral-400 text-base leading-relaxed">
              Read real stories from students who transformed their musical hobbies into lifelong skills and performances.
            </p>
          </div>

          {/* Slider Buttons */}
          <div className="flex items-center space-x-3 mt-6 md:mt-0">
            <button
              onClick={() => handleScroll('left')}
              className="p-3 rounded-full border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-3 rounded-full border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer"
              aria-label="Scroll Right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Slider */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-full md:w-[calc(50%-16px)] lg:w-[calc(33.33%-22px)] snap-start bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between text-left group hover:shadow-xl hover:border-neutral-700 transition-all duration-300 backdrop-blur-md"
            >
              <div className="space-y-6">
                {/* Rating stars & Quote Icon */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-neutral-800 group-hover:text-indigo-950/20 transition-colors duration-300 rotate-180" />
                </div>

                <p className="text-neutral-300 text-sm leading-relaxed italic">
                  "{test.feedback}"
                </p>
              </div>

              {/* Student Meta */}
              <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-neutral-800/60">
                <div className={`h-12 w-12 rounded-full font-bold flex items-center justify-center tracking-tight text-sm select-none ${test.color}`}>
                  {test.initials}
                </div>
                <div>
                  <h4 className="font-extrabold text-white leading-snug">
                    {test.name}
                  </h4>
                  <p className="text-xs text-neutral-400 font-semibold mt-0.5">
                    {test.course}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
