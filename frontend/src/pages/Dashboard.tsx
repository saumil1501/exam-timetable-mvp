import { useStats } from '@/hooks/useStats';

import {
  BookOpen,
  Users,
  CalendarDays,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';

import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

  const {
    stats,
    loading,
  } = useStats();

  const navigate =
    useNavigate();

  const statCards = [
    {

      icon:
        BookOpen,

      title:
        'Courses',

      value:
        stats?.totalCourses ||
        0,

      

      color:
        'text-blue-600',
    },

    {
      title:
        'Students',

      value:
        stats?.totalStudents ||
        0,

      icon:
        Users,

      color:
        'text-teal-500',
    },

    {
      title:
        'Enrollments',

      value:
        stats?.totalEnrollments ||
        0,

      icon:
        CalendarDays,

      color:
        'text-green-500',
    },

    {
      title:
        'Conflicts',

      value:
        stats?.potentialConflicts ||
        0,

      icon:
        AlertTriangle,

      color:
        'text-red-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          rounded-xl
          bg-gradient-to-r
          from-primary
          to-blue-700
          text-white
          p-8
          shadow-xl
        "
      >
        <h1
          className="
            text-4xl
            font-bold
            tracking-tight
          "
        >
          Dashboard
        </h1>

        <p
          className="
            mt-3
            text-blue-100
            max-w-2xl
          "
        >
          Generate conflict-free examination schedules,
          manage student enrollments and organize university examinations efficiently.
        </p>

        <div className="mt-6 flex gap-3">

          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() =>
              navigate(
                '/generate'
              )
            }
          >
            Generate Timetable
          </Button>

          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() =>
              navigate(
                '/courses'
              )
            }
          >
            View Courses
          </Button>

        </div>
      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >
        {statCards.map(
          (
            item,
            index
          ) => {
            const Icon =
              item.icon;

            return (
              <Card
                key={index}
                className="
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
              >
                <CardContent className="p-6">

                  <div className="flex justify-between">

                    <div>

                      <p
                        className="
                          text-sm
                          text-muted-foreground
                        "
                      >
                        {item.title}
                      </p>

                      <p
                        className="
                          mt-2
                          text-4xl
                          font-bold
                        "
                      >
                        {item.value}
                      </p>

                    </div>

                    <div
                      className="
                        h-14
                        w-14
                        rounded-2xl
                        bg-muted
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Icon
                        className={`
                          h-7
                          w-7
                          ${item.color}
                        `}
                      />
                    </div>

                  </div>

                </CardContent>
              </Card>
            );
          }
        )}
      </div>

      {/* DASHBOARD GRID */}

      <div
        className="
          grid
          lg:grid-cols-2
          gap-6
        "
      >

        {/* TOP COURSES */}

        <Card>

          <CardHeader>

            <CardTitle>
              Most Popular Courses
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="space-y-3">

              {stats?.topCourses?.map(
                (
                  course: any,
                  idx: number
                ) => (
                  <div
                    key={idx}
                    className="
                      flex
                      justify-between
                      items-center
                      p-4
                      rounded-xl
                      bg-muted/50
                    "
                  >

                    <div>

                      <p className="font-semibold">
                        {course.code}
                      </p>

                      <p
                        className="
                          text-sm
                          text-muted-foreground
                        "
                      >
                        {course.name}
                      </p>

                    </div>

                    <div
                      className="
                        text-right
                      "
                    >
                      <p
                        className="
                          text-xl
                          font-bold
                          text-primary
                        "
                      >
                        {
                          course.students
                        }
                      </p>

                      <p
                        className="
                          text-xs
                          text-muted-foreground
                        "
                      >
                        Students
                      </p>
                    </div>

                  </div>
                )
              )}

            </div>

          </CardContent>

        </Card>

        {/* QUICK ACTIONS */}

        <Card>

          <CardHeader>

            <CardTitle>
              Quick Actions
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="space-y-3">

              <Button
              variant="outline"
                className="
                  w-full
                  justify-between
                "
                onClick={() =>
                  navigate(
                    '/courses'
                  )
                }
              >
                Manage Courses

                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="
                  w-full
                  justify-between
                "
                onClick={() =>
                  navigate(
                    '/students'
                  )
                }
              >
                Manage Students

                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="
                  w-full
                  justify-between
                "
                onClick={() =>
                  navigate(
                    '/enrollments'
                  )
                }
              >
                Manage Enrollments

                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="
                  w-full
                  justify-between
                "
                onClick={() =>
                  navigate(
                    '/generate'
                  )
                }
              >
                Generate Timetable

                <ArrowRight className="h-4 w-4" />
              </Button>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}