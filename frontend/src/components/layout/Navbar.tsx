import { CalendarDays, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { Sidebar } from './Sidebar';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-shadow">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Exam Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
            Graph Coloring
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? (
            <Sun className="h-4 w-4 text-yellow-500" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </Button>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Sidebar onClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}