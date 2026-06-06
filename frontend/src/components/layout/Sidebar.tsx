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
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/courses',
    label: 'Courses',
    icon: BookOpen,
  },
  {
    to: '/students',
    label: 'Students',
    icon: Users,
  },
  {
    to: '/enrollments',
    label: 'Enrollments',
    icon: ClipboardList,
  },
  {
    to: '/generate',
    label: 'Generate Timetable',
    icon: CalendarPlus,
  },
  {
    to: '/timetables',
    label: 'Timetables',
    icon: CalendarDays,
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({
  onClose,
}: SidebarProps) {
  return (
    <div
      className="
        flex
        h-full
        flex-col
        bg-sidebar
        text-sidebar-foreground
      "
    >

      {/* HEADER */}

      {/* <div
        className="
          border-b
          border-sidebar-border
          px-6
          py-6
        "
      >
        <h2
          className="
            text-sm
            font-bold
            uppercase
            tracking-widest
            text-slate-400
          "
        >
          Examination Portal
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          Academic Management
        </p>
      </div> */}

      {/* NAVIGATION */}

      <nav
        className="
          flex-1
          px-4
          py-5
          space-y-2
        "
      >
        {navItems.map(
          (item) => {
            const Icon =
              item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={
                  item.to === '/'
                }
                onClick={onClose}
                className={({
                  isActive,
                }) =>
                  cn(
                    `
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    px-5
                    py-4
                    text-base
                    font-semibold
                    transition-all
                    duration-200
                    `,
                    isActive
                      ? `
                        bg-primary
                        text-primary-foreground
                        shadow-md
                      `
                      : `
                        text-slate-300
                        hover:bg-sidebar-accent
                        hover:text-white
                      `
                  )
                }
              >
                <Icon
                  className="
                    h-6
                    w-6
                    flex-shrink-0
                  "
                />

                <span>
                  {item.label}
                </span>
              </NavLink>
            );
          }
        )}
      </nav>

      {/* FOOTER */}

      {/* <div
        className="
          border-t
          border-sidebar-border
          p-4
        "
      >
        <div
          className="
            rounded-2xl
            bg-sidebar-accent
            p-5
          "
        >
          <p
            className="
              text-center
              text-sm
              font-semibold
            "
          >
            ADA Mini Project
          </p>

          <p
            className="
              mt-2
              text-center
              text-xs
              text-slate-400
            "
          >
            Exam Timetable Generator
          </p>

          <p
            className="
              mt-2
              text-center
              text-[11px]
              text-slate-500
            "
          >
            Greedy Graph Coloring
          </p>
        </div>
      </div> */}

    </div>
  );
}