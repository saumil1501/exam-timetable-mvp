import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTimetables } from '@/hooks/useTimetables';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface GeneratingStepProps {
  config: any;
  courseIds: string[];
  onComplete: (timetableId: string) => void;
  onBack: () => void;
}

export default function GeneratingStep({
  config,
  courseIds,
  onComplete,
  onBack,
}: GeneratingStepProps) {
  const { createTimetable, generateTimetable } = useTimetables();

  const [status, setStatus] = useState<'generating' | 'success' | 'error'>(
    'generating'
  );
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const generateFlow = async () => {
      try {
        setProgress(10);

        // Create timetable
        const result = await createTimetable({
          name: config.name,
          config: {
            slotsPerDay: config.slotsPerDay,
            maxDays: config.maxDays,
            examDurationMins: config.examDurationMins,
            breakDurationMins: config.breakDurationMins,
            startDate: config.startDate,
            morningStartTime: config.morningStartTime,
            afternoonStartTime: config.afternoonStartTime,
            eveningStartTime: config.eveningStartTime,
          },
          courseIds,
        });

        setProgress(30);

        // Run algorithm
        const generated = await generateTimetable(result._id);

        setProgress(100);
        setStats(generated.stats);
        setStatus('success');

        setTimeout(() => {
          onComplete(result._id);
        }, 2000);
      } catch (err: any) {
        setStatus('error');
        setError(err.message);
      }
    };

    generateFlow();
  }, []);

  return (
    <div className="space-y-6">
      {status === 'generating' && (
        <>
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Generating Timetable...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we create your exam schedule
            </p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Creating timetable record', threshold: 10 },
              { label: 'Building conflict graph', threshold: 30 },
              { label: 'Running greedy graph coloring', threshold: 60 },
              { label: 'Assigning dates and times', threshold: 90 },
              { label: 'Saving timetable', threshold: 100 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full ${
                    progress >= item.threshold
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                <span
                  className={
                    progress >= item.threshold
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-600'
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {status === 'success' && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Timetable Generated Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your exam schedule has been created without any conflicts.
          </p>

          {stats && (
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Courses</p>
                    <p className="text-2xl font-bold text-green-600">
                      {courseIds.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Slots Used</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.totalSlotsUsed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.totalDaysUsed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conflicts</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.conflictsFound}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-sm text-gray-500">
            Redirecting to timetable view...
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-600 mb-2">
            Generation Failed
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={onBack} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Configuration
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}