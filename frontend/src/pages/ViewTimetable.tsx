import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import { useTimetables } from '@/hooks/useTimetables';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import CalendarView from '@/components/timetable/CalendarView';
import GridView from '@/components/timetable/GridView';
import { exportTimetablePDF, exportTimetablePNG } from '@/utils/export';

export default function ViewTimetable() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTimetableById, deleteTimetable, getStatistics } = useTimetables();

  const [timetable, setTimetable] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'calendar' | 'grid'>('calendar');

  useEffect(() => {
    const loadTimetable = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const result = await getTimetableById(id);
        setTimetable(result);

        const statsResult = await getStatistics(id);
        setStats(statsResult);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTimetable();
  }, [id, getTimetableById, getStatistics]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this timetable?')) {
      try {
        await deleteTimetable(id!);
        navigate('/timetables');
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !timetable) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/timetables')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Timetables
        </Button>

        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
          <CardContent className="pt-6">
            <p className="text-red-700 dark:text-red-400">
              {error || 'Timetable not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColor =
    timetable.status === 'finalized'
      ? 'bg-green-100 text-green-800'
      : timetable.status === 'draft'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{timetable.name}</h1>
            <Badge className={statusColor}>
              {timetable.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created: {new Date(timetable.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
    variant="outline"
    onClick={() => exportTimetablePDF(timetable)}
  >
    Export PDF
  </Button>

  <Button
    variant="outline"
    onClick={() => exportTimetablePNG(timetable)}
  >
    Export PNG
  </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {[
    { label: 'Courses', value: stats.totalCourses },
    { label: 'Students', value: stats.totalStudents },
    { label: 'Slots Used', value: stats.totalSlots },
    { label: 'Conflicts', value: stats.conflictsCount },
  ].map((item, i) => (
    <Card key={i} className="text-center">
      <CardContent className="pt-6">
        <p className="text-3xl font-bold">{item.value}</p>
        <p className="text-sm text-muted-foreground">{item.label}</p>
      </CardContent>
    </Card>
  ))}
</div>
      )}

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-semibold">Slots Per Day</p>
              <p className="text-muted-foreground">
                {timetable.config.slotsPerDay}
              </p>
            </div>
            <div>
              <p className="font-semibold">Max Days</p>
              <p className="text-muted-foreground">
                {timetable.config.maxDays}
              </p>
            </div>
            <div>
              <p className="font-semibold">Exam Duration</p>
              <p className="text-muted-foreground">
                {timetable.config.examDurationMins} min
              </p>
            </div>
            <div>
              <p className="font-semibold">Break Duration</p>
              <p className="text-muted-foreground">
                {timetable.config.breakDurationMins} min
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Views */}
      <div id="timetable-content">
      {timetable.slots && timetable.slots.length > 0 ? (
        <Tabs value={view} onValueChange={(v: any) => setView(v)}>
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <CalendarView timetable={timetable} />
          </TabsContent>

          <TabsContent value="grid">
            <GridView timetable={timetable} />
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No slots generated yet. Please generate the timetable.
            </p>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Hidden Export Layout */}

<div
  id="timetable-export"
  style={{
    position: 'absolute',
    left: '-99999px',

    backgroundColor: '#ffffff',

    color: '#000000',

    width: '1200px',

    padding: '40px',
  }}
>
  <h1
    style={{
      fontSize: '28px',
      marginBottom: '10px',
    }}
  >
    {timetable.name}
  </h1>

  <p
    style={{
      marginBottom: '20px',
    }}
  >
    Examination Timetable
  </p>

  <table
    style={{
      width: '100%',
      borderCollapse: 'collapse',
    }}
  >
    <thead>
      <tr>
        <th style={{ border: '1px solid black', padding: '10px' }}>
          Date
        </th>

        <th style={{ border: '1px solid black', padding: '10px' }}>
          Session
        </th>

        <th style={{ border: '1px solid black', padding: '10px' }}>
          Start
        </th>

        <th style={{ border: '1px solid black', padding: '10px' }}>
          End
        </th>

        <th style={{ border: '1px solid black', padding: '10px' }}>
          Course
        </th>
      </tr>
    </thead>

    <tbody>
      {timetable.slots.map(
        (
          slot: any,
          index: number
        ) => (
          <tr key={index}>
            <td
              style={{
                border:
                  '1px solid black',
                padding:
                  '10px',
              }}
            >
              {new Date(
                slot.examDate
              ).toLocaleDateString()}
            </td>

            <td
              style={{
                border:
                  '1px solid black',
                padding:
                  '10px',
              }}
            >
              {slot.timeSlot}
            </td>

            <td
              style={{
                border:
                  '1px solid black',
                padding:
                  '10px',
              }}
            >
              {slot.startTime}
            </td>

            <td
              style={{
                border:
                  '1px solid black',
                padding:
                  '10px',
              }}
            >
              {slot.endTime}
            </td>

            <td
              style={{
                border:
                  '1px solid black',
                padding:
                  '10px',
              }}
            >
              {slot.courseId?.code}
            </td>
          </tr>
        )
      )}
    </tbody>
  </table>
</div>

      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate('/timetables')}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Timetables
      </Button>
    </div>
  );
}