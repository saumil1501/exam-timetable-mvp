import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  CalendarPlus,
  CalendarDays,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/enrollments', label: 'Enrollments', icon: ClipboardList },
  { to: '/generate', label: 'Generate', icon: CalendarPlus },
  { to: '/timetables', label: 'Timetables', icon: CalendarDays },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-white via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-6">
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Main Menu
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Navigate your workspace
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 scale-105'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                )
              }
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon */}
              <div className={cn(
                'relative flex-shrink-0',
                'transition-transform duration-300',
                'group-hover:scale-110 group-hover:rotate-12'
              )}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Label */}
              <span className="relative flex-1">{item.label}</span>

              {/* Arrow indicator - appears on hover/active */}
              <ChevronRight className={cn(
                'h-4 w-4 flex-shrink-0 relative transition-all duration-300',
                'opacity-0 -translate-x-2',
                'group-hover:opacity-100 group-hover:translate-x-0'
              )} />
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200/50 dark:border-slate-800/50 px-4 py-5">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 p-4 border border-blue-200/50 dark:border-blue-800/30">
          <p className="text-center text-xs font-bold text-blue-600 dark:text-blue-400">
            MVP Prototype
          </p>
          <p className="text-center text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
            Graph Coloring Algorithm
          </p>
        </div>
      </div>
    </div>
  );
}