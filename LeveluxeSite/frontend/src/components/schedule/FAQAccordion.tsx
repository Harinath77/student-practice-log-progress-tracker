import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQAccordion: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How do I join a batch?",
      answer: "To join a batch, first explore our courses and schedules, then head to our Contact page or click the Enroll button to submit your details. Our student coordinators will reach out within 24 hours to assign your tutor and finalize your schedule slot.",
    },
    {
      question: "Can I switch batches?",
      answer: "Yes, students can request batch switches if their routine changes. We allow up to two batch adjustments per quarter, subject to slot availability in the requested batch and approval from your class mentor.",
    },
    {
      question: "Do online classes follow the same schedule?",
      answer: "Online classes follow the same hourly time blocks but are hosted via our dedicated video academy portal. You will receive a secure video-room link 15 minutes before the scheduled start time of your session.",
    },
    {
      question: "Can beginners join anytime?",
      answer: "Beginner batches launch on the 1st and 15th of every month. We recommend enrolling at least one week prior to the batch start date so that we can organize your learning kits, study books, and instrument setups.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full py-20 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-450 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Got questions about batch shifts or session timing? We have answers.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="bg-neutral-900/40 border border-neutral-800 hover:border-neutral-750 rounded-2xl overflow-hidden transition-colors duration-250 backdrop-blur-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5 pr-4">
                    <HelpCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    <span className="font-bold text-white text-sm sm:text-base">
                      {faq.question}
                    </span>
                  </div>
                  <div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-neutral-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-neutral-900/50 text-neutral-400 text-xs sm:text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQAccordion;
