import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function MainLayout({
  children,
  darkMode,
  toggleDarkMode,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-white dark:bg-slate-950">
      {/* Navbar - Fixed at top */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Below navbar - flex row */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop only */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 overflow-y-auto lg:block">
          <Sidebar />
        </aside>

        {/* Main content - Fills remaining space */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}