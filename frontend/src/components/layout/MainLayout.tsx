import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function MainLayout({ children, darkMode, toggleDarkMode }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}