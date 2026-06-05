import { useStats } from '@/hooks/useStats';
import { useEnrollments } from '@/hooks/useEnrollments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, CalendarDays, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { stats, loading: statsLoading } = useStats();
  const { getAllConflicts } = useEnrollments();

  const navigate = useNavigate();

  const statCards = [
    {
      label: 'Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      color: 'from-blue-600 to-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'from-purple-600 to-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      label: 'Enrollments',
      value: stats?.totalEnrollments || 0,
      icon: CalendarDays,
      color: 'from-green-600 to-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Conflicts',
      value: stats?.potentialConflicts || 0,
      icon: AlertTriangle,
      color: 'from-red-600 to-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Overview of your exam timetable system
        </p>
      </div>

      {/* Statistics Grid */}
      {statsLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Card
                key={idx}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {card.label}
                      </p>
                      <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
                        {card.value}
                      </p>
                    </div>
                    <div className={`${card.bgColor} p-4 rounded-xl`}>
                      <Icon className="h-8 w-8 text-slate-900 dark:text-white opacity-70" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Top Courses Section */}
      {stats && stats.topCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Top Enrolled Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {course.code}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {course.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {course.students}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Students
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-blue-900 dark:text-blue-200">
            Get started with your exam timetable generator:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate('/courses')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Manage Courses
            </Button>
            <Button
              onClick={() => navigate('/students')}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400"
            >
              Manage Students
            </Button>
            <Button
              onClick={() => navigate('/enrollments')}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400"
            >
              Set Enrollments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}