import {
  useParams,
  useNavigate,
} from 'react-router-dom';

import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowLeft,
  Download,
  Trash2,
  CalendarDays,
  Users,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';

import {
  useTimetables,
} from '@/hooks/useTimetables';

import {
  Button,
} from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import {
  LoadingSpinner,
} from '@/components/common/LoadingSpinner';

import {
  Badge,
} from '@/components/ui/badge';

import CalendarView from '@/components/timetable/CalendarView';

import GridView from '@/components/timetable/GridView';

import {
  exportTimetablePDF,
  exportTimetablePNG,
} from '@/utils/export';

export default function ViewTimetable() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    getTimetableById,
    deleteTimetable,
    getStatistics,
  } = useTimetables();

  const [timetable, setTimetable] =
    useState<any>(null);

  const [stats, setStats] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [view, setView] =
    useState('calendar');

  useEffect(() => {

    const load =
      async () => {

        if (!id) return;

        try {

          const data =
            await getTimetableById(
              id
            );

          const statData =
            await getStatistics(
              id
            );

          setTimetable(data);

          setStats(
            statData
          );

        } finally {

          setLoading(
            false
          );
        }
      };

    load();

  }, []);

  if (
    loading
  ) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (
    !timetable
  ) {
    return (
      <div>
        Timetable not found
      </div>
    );
  }

  const deleteSchedule =
    async () => {

      if (
        !confirm(
          'Delete timetable?'
        )
      ) {
        return;
      }

      await deleteTimetable(
        timetable._id
      );

      navigate(
        '/timetables'
      );
    };

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          rounded-3xl
          bg-gradient-to-r
          from-primary
          to-blue-700
          text-white
          p-8
        "
      >

        <div
          className="
            flex
            justify-between
            items-start
            gap-6
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <h1
                className="
                  text-4xl
                  font-bold
                "
              >
                {
                  timetable.name
                }
              </h1>

              <Badge
                className="
                  bg-white/20
                  text-white
                  border-0
                "
              >
                {
                  timetable.status
                }
              </Badge>

            </div>

            <p
              className="
                mt-3
                text-blue-100
              "
            >
              Official Examination Schedule
            </p>

          </div>

          <div className="flex gap-2">

            <Button
              variant="secondary"
              onClick={() =>
                exportTimetablePDF(
                  timetable
                )
              }
            >
              Export PDF
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                exportTimetablePNG(
                  timetable
                )
              }
            >
              Export PNG
            </Button>

            <Button
              variant="destructive"
              onClick={
                deleteSchedule
              }
            >
              Delete
            </Button>

          </div>

        </div>

      </div>

      {/* STATS */}

      {stats && (

        <div
          className="
            grid
            md:grid-cols-4
            gap-4
          "
        >

          <Card>

            <CardContent className="p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">
                    Courses
                  </p>

                  <p className="text-4xl font-bold text-primary">
                    {
                      stats.totalCourses
                    }
                  </p>

                </div>

                <BookOpen className="h-8 w-8 text-primary" />

              </div>

            </CardContent>

          </Card>

          <Card>

            <CardContent className="p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">
                    Students
                  </p>

                  <p className="text-4xl font-bold text-teal-600">
                    {
                      stats.totalStudents
                    }
                  </p>

                </div>

                <Users className="h-8 w-8 text-teal-600" />

              </div>

            </CardContent>

          </Card>

          <Card>

            <CardContent className="p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">
                    Slots
                  </p>

                  <p className="text-4xl font-bold text-green-600">
                    {
                      stats.totalSlots
                    }
                  </p>

                </div>

                <CalendarDays className="h-8 w-8 text-green-600" />

              </div>

            </CardContent>

          </Card>

          <Card>

            <CardContent className="p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">
                    Conflicts
                  </p>

                  <p className="text-4xl font-bold text-red-500">
                    {
                      stats.conflictsCount
                    }
                  </p>

                </div>

                <AlertTriangle className="h-8 w-8 text-red-500" />

              </div>

            </CardContent>

          </Card>

        </div>

      )}

      {/* CONFIG */}

      <Card>

        <CardHeader>

          <CardTitle>
            Examination Configuration
          </CardTitle>

        </CardHeader>

        <CardContent>

          <div
            className="
              grid
              md:grid-cols-4
              gap-6
            "
          >

            <div>

              <p className="text-sm text-muted-foreground">
                Start Date
              </p>

              <p className="font-semibold">
                {
                  timetable.config
                    .startDate
                }
              </p>

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Duration
              </p>

              <p className="font-semibold">
                {
                  timetable.config
                    .examDurationMins
                } mins
              </p>

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Slots Per Day
              </p>

              <p className="font-semibold">
                {
                  timetable.config
                    .slotsPerDay
                }
              </p>

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Total Days
              </p>

              <p className="font-semibold">
                {
                  timetable.totalDaysUsed
                }
              </p>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* VIEWS */}

      <Tabs
        value={view}
        onValueChange={
          setView
        }
      >

        <TabsList>

          <TabsTrigger value="calendar">
            Calendar View
          </TabsTrigger>

          <TabsTrigger value="grid">
            Grid View
          </TabsTrigger>

        </TabsList>

        <TabsContent value="calendar">

          <CalendarView
            timetable={
              timetable
            }
          />

        </TabsContent>

        <TabsContent value="grid">

          <GridView
            timetable={
              timetable
            }
          />

        </TabsContent>

      </Tabs>

      {/* BACK */}

      <Button
        variant="outline"
        onClick={() =>
          navigate(
            '/timetables'
          )
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />

        Back to Timetables

      </Button>

    </div>
  );
}