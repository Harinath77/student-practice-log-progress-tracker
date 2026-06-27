import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Instructors from './pages/Instructors';
import Schedule from './pages/SchedulePage';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/contact" element={<Contact />} />
          {/* Fallback route */}
          <Route path="*" element={
            <div className="py-12 text-center">
              <h2 className="text-2xl font-bold text-neutral-900">404 - Page Not Found</h2>
              <p className="mt-2 text-neutral-600">The page you are looking for does not exist.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
