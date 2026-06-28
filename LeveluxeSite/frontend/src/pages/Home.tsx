import React, { useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import FeaturedCourses from '../components/home/FeaturedCourses';
import WhyChooseUs from '../components/home/WhyChooseUs';
import StatsSection from '../components/home/StatsSection';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';
import EnrollmentModal from '../components/enroll/EnrollmentModal';

const Home: React.FC = () => {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  return (
    <div className="w-full flex flex-col">
      <HeroSection onEnrollClick={() => setIsEnrollOpen(true)} />
      <AboutSection />
      <FeaturedCourses />
      <WhyChooseUs />
      <StatsSection />
      <Testimonials />
      <CTASection onEnrollClick={() => setIsEnrollOpen(true)} />

      {/* Enrollment Modal */}
      <EnrollmentModal 
        isOpen={isEnrollOpen} 
        onClose={() => setIsEnrollOpen(false)} 
      />
    </div>
  );
};

export default Home;
