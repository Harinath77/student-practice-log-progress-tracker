import React from 'react';
import { motion } from 'framer-motion';
import CourseCard from './CourseCard';

const FeaturedCourses: React.FC = () => {
  const courses = [
    {
      name: "Guitar (Acoustic & Electric)",
      description: "Master acoustic and electric guitar. Learn essential chord shapes, strumming patterns, fingerstyle techniques, and soloing scales.",
      level: "Beginner",
      duration: "24 Weeks",
      image: ""
    },
    {
      name: "Piano (Classical & Modern)",
      description: "Develop solid classical foundations and modern styles. Covers sight-reading, dual-hand coordination, scale structures, and expressive solos.",
      level: "Intermediate",
      duration: "36 Weeks",
      image: ""
    },
    {
      name: "Keyboard (Synthesizer)",
      description: "Explore keyboard play, synth sound-design, rhythm mapping, chords, and live stage accompaniment techniques.",
      level: "Beginner",
      duration: "24 Weeks",
      image: ""
    },
    {
      name: "Violin (Classical Repertoire)",
      description: "Acquire correct body posture, violin bowing control, perfect pitch intonation, and study classic string compositions.",
      level: "Advanced",
      duration: "48 Weeks",
      image: ""
    },
    {
      name: "Drums & Percussion",
      description: "Build tempo accuracy, four-way limb coordination, stick grip control, grooves, and play along with pop, rock, and jazz beats.",
      level: "Beginner",
      duration: "24 Weeks",
      image: ""
    },
    {
      name: "Vocal Music Training",
      description: "Improve pitch accuracy, lung/breath control, vocal projection, articulation, style expression, and vocal cords health.",
      level: "Beginner",
      duration: "12 Weeks",
      image: ""
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <section id="courses" className="w-full py-20 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-indigo-400 font-bold text-xs tracking-widest uppercase">
            Start Learning
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Popular Courses
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Choose from our flagship music courses meticulously designed for all ages, from complete beginners to advanced musicians aiming for certifications.
          </p>
        </div>

        {/* Grid Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course, index) => (
            <motion.div key={index} variants={itemVariants}>
              <CourseCard
                image={course.image}
                name={course.name}
                description={course.description}
                level={course.level}
                duration={course.duration}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedCourses;
