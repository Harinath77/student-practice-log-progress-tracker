import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Instructors from './pages/Instructors';
import InstructorDetails from './pages/InstructorDetails';
import Schedule from './pages/SchedulePage';
import Contact from './pages/Contact';

// Scroll Restoration helper component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/instructors/:id" element={<InstructorDetails />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/contact" element={<Contact />} />
          {/* Fallback route */}
          <Route path="*" element={
            <div className="py-24 text-center bg-neutral-950 text-white min-h-[60vh] flex flex-col justify-center items-center space-y-4">
              <h2 className="text-4xl font-extrabold text-white">404 - Page Not Found</h2>
              <p className="text-neutral-400 text-sm max-w-sm">The musical path you are looking for does not exist or has been shifted to a new slot.</p>
              <Link to="/" className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-6 py-2.5 rounded-xl transition-all">
                Return Home
              </Link>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
