import { NavLink } from 'react-router-dom';

import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  CalendarPlus,
  CalendarDays,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & stats',
  },
  {
    to: '/courses',
    label: 'Courses',
    icon: BookOpen,
    description: 'Manage subjects',
  },
  {
    to: '/students',
    label: 'Students',
    icon: Users,
    description: 'Student records',
  },
  {
    to: '/enrollments',
    label: 'Enrollments',
    icon: ClipboardList,
    description: 'Course enrollments',
  },
  {
    to: '/generate',
    label: 'Generate',
    icon: CalendarPlus,
    description: 'New timetable',
    highlight: true,
  },
  {
    to: '/timetables',
    label: 'Timetables',
    icon: CalendarDays,
    description: 'View schedules',
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* HEADER */}
      <div className="border-b border-sidebar-border/50 px-6 py-6">
        <div className="flex items-center gap-3">
          
          
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        

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
                  'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-slate-300 hover:bg-sidebar-accent hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-white/80" />
                  )}

                  {/* Icon container */}
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-colors flex-shrink-0',
                      isActive
                        ? 'bg-white/15'
                        : 'bg-sidebar-accent/40 group-hover:bg-sidebar-accent'
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  {/* Label + description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{item.label}</span>
                      
                    </div>
                    <p
                      className={cn(
                        'text-[11px] truncate transition-colors',
                        isActive
                          ? 'text-white/70'
                          : 'text-slate-500 group-hover:text-slate-400'
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-sidebar-border/50 p-4">
        <div className="rounded-xl bg-gradient-to-br from-sidebar-accent/60 to-sidebar-accent/30 p-4 border border-sidebar-border/30">
          <div className="flex items-center gap-2 mb-1">
            
            
          </div>
          
        </div>

        
      </div>
    </div>
  );
}