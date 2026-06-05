import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Courses from '@/pages/Courses';
import Students from '@/pages/Students';
import Enrollments from '@/pages/Enrollments';
import Generate from '@/pages/Generate';
import Timetables from '@/pages/Timetables';
import ViewTimetable from '@/pages/ViewTimetable';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <BrowserRouter>
      <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/students" element={<Students />} />
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/timetables" element={<Timetables />} />
          <Route path="/timetables/:id" element={<ViewTimetable />} />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Page not found
                </p>
              </div>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;