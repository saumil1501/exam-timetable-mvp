import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  CalendarPlus,
  CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/',           label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/courses',    label: 'Courses',     icon: BookOpen },
  { to: '/students',   label: 'Students',    icon: Users },
  { to: '/enrollments',label: 'Enrollments', icon: ClipboardList },
  { to: '/generate',   label: 'Generate',    icon: CalendarPlus },
  { to: '/timetables', label: 'Timetables',  icon: CalendarDays },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-border/40 bg-background">
      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/40 p-4">
        <p className="text-xs text-muted-foreground text-center">
          MVP Prototype v1.0
        </p>
      </div>
    </aside>
  );
}