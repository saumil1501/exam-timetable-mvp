import { BookOpen, Users, CalendarDays, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { label: 'Courses',     value: 0, icon: BookOpen,       color: 'bg-blue-500' },
  { label: 'Students',    value: 0, icon: Users,           color: 'bg-purple-500' },
  { label: 'Timetables',  value: 0, icon: CalendarDays,    color: 'bg-green-500' },
  { label: 'Conflicts',   value: 0, icon: AlertTriangle,   color: 'bg-red-500' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your exam timetable system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">
            Welcome! Start by adding courses and students, then generate your timetable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}