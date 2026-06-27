import React from 'react';
import { motion } from 'framer-motion';
import InstructorCard from './InstructorCard';
import type { Instructor } from '../../types/instructor';

interface InstructorGridProps {
  instructors: Instructor[];
}

const InstructorGrid: React.FC<InstructorGridProps> = ({ instructors }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full"
    >
      {instructors.map((instructor) => (
        <motion.div key={instructor.id} variants={itemVariants}>
          <InstructorCard instructor={instructor} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default InstructorGrid;
