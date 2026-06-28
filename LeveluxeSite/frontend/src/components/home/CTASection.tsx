import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';

interface CTASectionProps {
  onEnrollClick?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onEnrollClick }) => {
  return (
    <section id="enroll" className="relative w-full py-24 overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950 text-white text-center border-t border-neutral-900 shadow-xl">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[130px] -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            Limited Batches Open
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight pt-2 leading-tight">
            Start Your Musical Journey Today
          </h2>
          <p className="text-neutral-350 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you want to learn Guitar, Piano, Drums, Violin, Keyboard, or Vocal training, our certified faculty is here to guide you step-by-step. Secure your trial class today!
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={onEnrollClick}
            className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-500/20 active:scale-95 group cursor-pointer"
          >
            Enroll Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            Contact Us
            <MessageSquare className="ml-2 h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default CTASection;
