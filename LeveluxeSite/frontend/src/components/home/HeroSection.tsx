import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Music4 } from 'lucide-react';

const EqualizerBar: React.FC<{ delay: number; duration: number; heightRange: number[] }> = ({ delay, duration, heightRange }) => {
  return (
    <motion.div
      className="w-2.5 bg-gradient-to-t from-indigo-600 via-indigo-400 to-yellow-400 rounded-full"
      animate={{
        height: heightRange
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay
      }}
    />
  );
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950 text-white overflow-hidden pt-28 pb-16">
      {/* Dynamic ambient glowing circles */}
      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[130px]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-500/10 blur-[130px]" />

      {/* Grid line background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8 text-left"
          >
            <span className="inline-block text-yellow-400 font-bold uppercase tracking-widest text-xs bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
              Leveluxe Modern Music Academy
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Learn Music. <br />
              <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">Build Confidence.</span> <br />
              Perform with Passion.
            </h1>

            <p className="text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Join Hyderabad's modern music academy offering world-class training in Guitar, Piano, Keyboard, Violin, Drums and Vocal Music for students of every age.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#enroll"
                className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-500/20 active:scale-95 group"
              >
                Enroll Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#courses"
                className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border border-white/10 transition-all duration-200 active:scale-95"
              >
                Explore Courses
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-6">
              <div className="flex items-center space-x-2.5">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-base font-extrabold text-white leading-none">500+</p>
                  <p className="text-xs text-neutral-400 mt-1">Students</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-base font-extrabold text-white leading-none">15+</p>
                  <p className="text-xs text-neutral-400 mt-1">Instructors</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-base font-extrabold text-white leading-none">10 Yrs</p>
                  <p className="text-xs text-neutral-400 mt-1">Experience</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Sound Equalizer Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="relative flex justify-center w-full"
          >
            <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl filter blur-3xl opacity-40 transform scale-95" />

            <div className="relative border border-white/5 p-8 rounded-3xl bg-neutral-900/40 backdrop-blur-2xl max-w-md w-full aspect-square flex flex-col justify-between overflow-hidden shadow-2xl">
              
              {/* Header inside Panel */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <Music4 className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none">Live Visualizer</p>
                    <p className="text-sm font-semibold text-white mt-1">Sound Waves & Frequencies</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Equalisers Area */}
              <div className="flex-grow flex items-end justify-center space-x-2 h-44 py-6">
                <EqualizerBar delay={0.1} duration={1.2} heightRange={[20, 120, 40]} />
                <EqualizerBar delay={0.3} duration={0.8} heightRange={[40, 160, 60]} />
                <EqualizerBar delay={0.5} duration={1.5} heightRange={[15, 90, 30]} />
                <EqualizerBar delay={0.2} duration={1.0} heightRange={[50, 140, 70]} />
                <EqualizerBar delay={0.7} duration={1.3} heightRange={[30, 180, 50]} />
                <EqualizerBar delay={0.4} duration={0.9} heightRange={[60, 110, 80]} />
                <EqualizerBar delay={0.9} duration={1.1} heightRange={[20, 150, 40]} />
                <EqualizerBar delay={0.6} duration={1.4} heightRange={[45, 100, 55]} />
                <EqualizerBar delay={0.8} duration={0.7} heightRange={[10, 130, 20]} />
              </div>

              {/* Footer inside Panel */}
              <div className="text-left pt-4 border-t border-white/5 space-y-1">
                <p className="text-xs text-neutral-400 font-bold">LOBBY / PRACTICE ROOMS</p>
                <p className="text-xs text-neutral-500">Connecting student training nodes to the database session</p>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
