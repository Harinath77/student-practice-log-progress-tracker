import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface CounterProps {
  target: number;
  duration?: number; // in seconds
}

const Counter: React.FC<CounterProps> = ({ target, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * target));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, target, duration]);

  return <span ref={elementRef}>{count}</span>;
};

const StatsSection: React.FC = () => {
  const stats = [
    { target: 500, suffix: "+", label: "Active Students" },
    { target: 25, suffix: "+", label: "Specialized Courses" },
    { target: 15, suffix: "+", label: "Expert Instructors" },
    { target: 10, suffix: "+", label: "Years Experience" }
  ];

  return (
    <section className="w-full bg-gradient-to-br from-indigo-950/40 via-neutral-950 to-indigo-950/40 text-white py-16 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center space-y-2"
            >
              <p className="text-4xl sm:text-5xl font-extrabold text-indigo-400 tracking-tight">
                <Counter target={stat.target} />
                <span>{stat.suffix}</span>
              </p>
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-450">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
