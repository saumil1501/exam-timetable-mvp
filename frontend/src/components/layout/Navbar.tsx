import {
  CalendarDays,
  Moon,
  Sun,
  Menu,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

import { useState } from 'react';

import { Sidebar } from './Sidebar';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Navbar({
  darkMode,
  toggleDarkMode,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <header
      className="
        sticky
        top-0
        z-50
        h-16
        border-b
        border-border
        bg-background/90
        backdrop-blur-xl
        shadow-sm
      "
    >
      <div className="flex h-full items-center justify-between px-6">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">

          {/* Logo */}
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-primary
              text-primary-foreground
              shadow-lg
            "
          >
            <CalendarDays className="h-5 w-5" />
          </div>

          {/* Branding */}
          <div>
            <h1
              className="
                text-lg
                font-bold
                tracking-tight
                text-foreground
              "
            >
              Exam Timetable System
            </h1>

            <p
              className="
                text-xs
                text-muted-foreground
                -mt-0.5
              "
            >
              Conflict-Free Examination Scheduling
            </p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="
              h-10
              w-10
              rounded-xl
              hover:bg-muted
            "
          >
            {darkMode ? (
              <Sun
                className="
                  h-5
                  w-5
                  text-yellow-500
                "
              />
            ) : (
              <Moon
                className="
                  h-5
                  w-5
                  text-primary
                "
              />
            )}
          </Button>

          {/* Mobile Sidebar */}
          <Sheet
            open={mobileOpen}
            onOpenChange={setMobileOpen}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="
                  lg:hidden
                  h-10
                  w-10
                  rounded-xl
                "
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="
                w-72
                p-0
              "
            >
              <SheetTitle className="sr-only">
                Navigation
              </SheetTitle>

              <Sidebar
                onClose={() =>
                  setMobileOpen(false)
                }
              />
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  );
}