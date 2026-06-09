import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Eye, Trash2, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTimetables } from '@/hooks/useTimetables';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { exportTimetablePDF } from '@/utils/export';

export default function Timetables() {
  const navigate = useNavigate();

  const {
    timetables,
    setTimetables,
    loading,
    fetchTimetables,
    deleteTimetable,
  } = useTimetables();

  useEffect(() => {
    fetchTimetables();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this timetable?'))
      return;

    try {
      const success = await deleteTimetable(id);
      if (success) {
        setTimetables(timetables.filter((t: any) => t._id !== id));
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

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
      <div className="rounded-3xl bg-gradient-to-r from-primary to-blue-700 text-white p-8">
        <h1 className="text-4xl font-bold">Generated Timetables</h1>
        <p className="mt-2 text-blue-100">
          View, download and manage previously generated examination schedules.
        </p>
      </div>

      {/* TIMETABLE LIST */}
      {timetables.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">
              No timetables generated yet
            </p>
            <p className="text-muted-foreground mt-2">
              Generate your first timetable to see it here.
            </p>
            <Button className="mt-6" onClick={() => navigate('/generate')}>
              Generate Timetable
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timetables.map((timetable: any) => (
            <Card
              key={timetable._id}
              className="hover:shadow-lg transition-all"
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{timetable.name}</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-muted">
                    {timetable.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>
                    Created:{' '}
                    {new Date(timetable.createdAt).toLocaleDateString()}
                  </p>
                  <p>Slots Used: {timetable.totalSlotsUsed}</p>
                  <p>Days: {timetable.totalDaysUsed}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/timetables/${timetable._id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportTimetablePDF(timetable)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(timetable._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}