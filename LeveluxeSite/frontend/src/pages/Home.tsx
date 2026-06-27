import type { FC } from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import FeaturedCourses from '../components/home/FeaturedCourses';
import WhyChooseUs from '../components/home/WhyChooseUs';
import StatsSection from '../components/home/StatsSection';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';

const Home: FC = () => {
  return (
    <div className="w-full flex flex-col">
      <HeroSection />
      <AboutSection />
      <FeaturedCourses />
      <WhyChooseUs />
      <StatsSection />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default Home;
