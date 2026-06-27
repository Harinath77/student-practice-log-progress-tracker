import React from 'react';
import { motion } from 'framer-motion';
import { Award, Music, Users, ShieldCheck, GraduationCap } from 'lucide-react';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <Award className="h-6 w-6 text-yellow-400" />,
      title: "Professional Instructors",
      description: "Learn from certified educators, experienced session musicians, and conservatory alumni who specialize in modern teaching methods."
    },
    {
      icon: <Music className="h-6 w-6 text-yellow-400" />,
      title: "Performance Opportunities",
      description: "Build stage confidence through our seasonal acoustic sessions, rock band showcases, and annual academy concerts."
    },
    {
      icon: <Users className="h-6 w-6 text-yellow-400" />,
      title: "Small Batch Sizes",
      description: "Receive personalized mentorship with our restricted batch limits, ensuring focused development and individual attention."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-yellow-400" />,
      title: "Certification Programs",
      description: "Get structured learning with preparation for international music exams (Trinity College London, ABRSM, Rockschool)."
    }
  ];

  return (
    <section className="w-full py-20 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Custom Glowing Mentor Icon Container */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Background blur layers */}
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-500/5 rounded-full mix-blend-multiply filter blur-2xl opacity-60 -z-10" />
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-yellow-500/5 rounded-full mix-blend-multiply filter blur-2xl opacity-60 -z-10" />

            <div className="relative rounded-3xl p-12 border border-neutral-800 bg-neutral-900/40 backdrop-blur-xl h-[450px] flex flex-col justify-between overflow-hidden shadow-2xl text-left group">
              {/* Central huge glowing icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 group-hover:text-yellow-500/5 transition-colors duration-300 pointer-events-none">
                <GraduationCap className="h-72 w-72 stroke-[0.5]" />
              </div>

              <div className="space-y-4">
                <div className="inline-flex p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                  <GraduationCap className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Interactive Music Training</h3>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
                  Experience a performance-first training syllabus. Our classrooms are designed to facilitate collaborative learning, jamming sessions, and instant mentorship.
                </p>
              </div>

              {/* Stat callout bubble inside */}
              <div className="border border-neutral-800/80 bg-neutral-900/60 p-6 rounded-2xl max-w-xs relative z-10">
                <p className="font-extrabold text-2xl text-yellow-500 leading-none">100%</p>
                <p className="text-xs text-neutral-400 font-semibold mt-1.5">Performance-oriented learning environment.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Mission and Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-left"
          >
            <div className="space-y-4">
              <span className="text-indigo-400 font-bold text-xs tracking-widest uppercase">
                About the Academy
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Why Choose Leveluxe?
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed">
                Our mission is to help students discover and develop their musical talent through structured, practical, and performance-oriented learning. We move beyond rote learning to foster creativity, build confidence, and inspire lifelong passion.
              </p>
            </div>

            {/* Grid of features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col space-y-2.5 p-4 rounded-2xl border border-neutral-900/50 hover:bg-neutral-900/40 hover:border-neutral-800 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-white text-base">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed pl-1">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
