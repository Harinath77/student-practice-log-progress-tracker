import React from 'react';
import { Sunrise, Sun, Moon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface BatchInfo {
  name: string;
  time: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
}

export const BatchCards: React.FC = () => {
  const batches: BatchInfo[] = [
    {
      name: "Morning Batch",
      time: "7:00 AM – 10:00 AM",
      description: "Perfect for early birds, school students, and working professionals who want to kickstart their day with creative musical energy.",
      icon: <Sunrise className="h-6 w-6 text-yellow-500" />,
    },
    {
      name: "Afternoon Batch",
      time: "1:00 PM – 4:00 PM",
      description: "Tailored for college students, home makers, and flexible schedule professionals. Ideal for focused, distraction-free practice sessions.",
      icon: <Sun className="h-6 w-6 text-yellow-500" />,
    },
    {
      name: "Evening Batch",
      time: "5:00 PM – 8:30 PM",
      description: "Our most popular slot. High-energy group classes, jam sessions, and core training classes that happen after regular working hours.",
      icon: <Moon className="h-6 w-6 text-yellow-500" />,
      popular: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <section className="w-full py-16 bg-neutral-900/30 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            Batch Slots
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Academy Batch Offerings
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            We offer flexible training divisions throughout the day so you can balance your passion for music with your academic or professional life.
          </p>
        </div>

        {/* Batch Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {batches.map((batch) => (
            <motion.div
              key={batch.name}
              variants={itemVariants}
              className={`relative bg-neutral-900/40 border rounded-3xl p-8 text-left hover:shadow-lg transition-all duration-300 backdrop-blur-md overflow-hidden ${
                batch.popular ? 'border-yellow-500/50 shadow-md shadow-yellow-500/5' : 'border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              {batch.popular && (
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-yellow-500 text-neutral-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>Popular</span>
                </div>
              )}

              <div className="inline-flex p-3 bg-neutral-950 rounded-2xl border border-neutral-800 mb-6">
                {batch.icon}
              </div>

              <h3 className="text-xl font-extrabold text-white mb-2">
                {batch.name}
              </h3>
              
              <p className="text-yellow-400 font-bold text-sm mb-4">
                {batch.time}
              </p>

              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                {batch.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default BatchCards;
