import React from 'react';
import { motion } from 'framer-motion';
import { Home, Clock, Users, BadgeDollarSign } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const cards = [
    {
      icon: <Home className="h-8 w-8 text-yellow-500" />,
      title: "Modern Facilities",
      description: "Practice in soundproof acoustic studios equipped with professional grade guitars, keyboards, recording equipment, and acoustic grand pianos."
    },
    {
      icon: <Clock className="h-8 w-8 text-yellow-500" />,
      title: "Flexible Timings",
      description: "Schedule your practices seamlessly with our customizable slots. Choose weekday sessions or weekend classes according to your schedule."
    },
    {
      icon: <Users className="h-8 w-8 text-yellow-500" />,
      title: "Experienced Faculty",
      description: "Learn from Trinity/Rockschool certified educators and active performers who construct tailormade learning paths for students."
    },
    {
      icon: <BadgeDollarSign className="h-8 w-8 text-yellow-500" />,
      title: "Affordable Fees",
      description: "Get premium, international-standard music instruction at competitive pricing plans with flexible billing and installment options."
    }
  ];

  return (
    <section className="w-full py-20 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-indigo-400 font-bold text-xs tracking-widest uppercase">
            Academy Benefits
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Excellence
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            We provide a premium educational infrastructure, making music learning engaging, structured, and completely student-centric.
          </p>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-neutral-900/60 text-white rounded-3xl p-8 border border-neutral-800/80 shadow-lg relative overflow-hidden group text-left backdrop-blur-md"
            >
              {/* Glow Accent */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-500/5 rounded-full filter blur-xl group-hover:bg-yellow-500/10 transition-colors duration-300" />
              
              <div className="space-y-6 relative z-10">
                <div className="inline-flex p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-yellow-500/10 group-hover:border-yellow-500/20 transition-all duration-300">
                  {card.icon}
                </div>
                
                <h3 className="text-xl font-extrabold tracking-tight group-hover:text-yellow-400 transition-colors duration-200">
                  {card.title}
                </h3>
                
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
