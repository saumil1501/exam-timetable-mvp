import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface ConfigStepProps {
  config: any;
  onNext: (config: any) => void;
}

export default function ConfigStep({
  config: initialConfig,
  onNext,
}: ConfigStepProps) {
  const [config, setConfig] = useState(initialConfig);
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!config.name.trim()) newErrors.name = 'Name is required';
    if (!config.startDate) newErrors.startDate = 'Start date is required';
    if (config.slotsPerDay < 1) newErrors.slotsPerDay = 'Must be at least 1';
    if (config.maxDays < 1) newErrors.maxDays = 'Must be at least 1';
    if (config.examDurationMins < 30)
      newErrors.examDurationMins = 'Must be at least 30 minutes';
    if (!config.morningStartTime)
      newErrors.morningStartTime = 'Morning start time required';
    if (config.slotsPerDay >= 2 && !config.afternoonStartTime)
      newErrors.afternoonStartTime = 'Afternoon start time required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext(config);
    }
  };

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <Label htmlFor="name">Timetable Name *</Label>
        <Input
          id="name"
          value={config.name}
          onChange={(e) => setConfig({ ...config, name: e.target.value })}
          placeholder="e.g., Fall 2024 Final Exams"
          className="mt-2"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Start Date */}
      <div>
        <Label htmlFor="startDate">Exam Start Date *</Label>
        <Input
          id="startDate"
          type="date"
          value={config.startDate}
          onChange={(e) =>
            setConfig({ ...config, startDate: e.target.value })
          }
          className="mt-2"
        />
        {errors.startDate && (
          <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
        )}
      </div>

      {/* Slots Per Day */}
      <div>
        <Label htmlFor="slotsPerDay">Exam Slots Per Day *</Label>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1">
            <input
              type="range"
              min="1"
              max="3"
              value={config.slotsPerDay}
              onChange={(e) =>
                setConfig({
                  ...config,
                  slotsPerDay: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
          <div className="text-2xl font-bold text-blue-600 w-12">
            {config.slotsPerDay}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {config.slotsPerDay === 1 && 'Morning only'}
          {config.slotsPerDay === 2 && 'Morning & Afternoon'}
          {config.slotsPerDay === 3 && 'Morning, Afternoon & Evening'}
        </p>
      </div>

      {/* Session Times */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Morning */}
        <div>
          <Label htmlFor="morningStartTime">Morning Start *</Label>
          <Input
            id="morningStartTime"
            type="time"
            value={config.morningStartTime}
            onChange={(e) =>
              setConfig({
                ...config,
                morningStartTime: e.target.value,
              })
            }
            className="mt-2"
          />
          {errors.morningStartTime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.morningStartTime}
            </p>
          )}
        </div>

        {/* Afternoon */}
        {config.slotsPerDay >= 2 && (
          <div>
            <Label htmlFor="afternoonStartTime">Afternoon Start *</Label>
            <Input
              id="afternoonStartTime"
              type="time"
              value={config.afternoonStartTime}
              onChange={(e) =>
                setConfig({
                  ...config,
                  afternoonStartTime: e.target.value,
                })
              }
              className="mt-2"
            />
            {errors.afternoonStartTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.afternoonStartTime}
              </p>
            )}
          </div>
        )}

        {/* Evening */}
        {config.slotsPerDay >= 3 && (
          <div>
            <Label htmlFor="eveningStartTime">Evening Start</Label>
            <Input
              id="eveningStartTime"
              type="time"
              value={config.eveningStartTime}
              onChange={(e) =>
                setConfig({
                  ...config,
                  eveningStartTime: e.target.value,
                })
              }
              className="mt-2"
            />
          </div>
        )}
      </div>

      {/* Max Days */}
      <div>
        <Label htmlFor="maxDays">Maximum Days Available *</Label>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1">
            <input
              type="range"
              min="5"
              max="30"
              value={config.maxDays}
              onChange={(e) =>
                setConfig({
                  ...config,
                  maxDays: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
          <div className="text-2xl font-bold text-blue-600 w-12">
            {config.maxDays}
          </div>
        </div>
        {errors.maxDays && (
          <p className="text-red-500 text-sm mt-1">{errors.maxDays}</p>
        )}
      </div>

      {/* Exam Duration */}
      <div>
        <Label htmlFor="examDurationMins">Exam Duration (minutes) *</Label>
        <Input
          id="examDurationMins"
          type="number"
          min="30"
          max="240"
          value={config.examDurationMins}
          onChange={(e) =>
            setConfig({
              ...config,
              examDurationMins: parseInt(e.target.value),
            })
          }
          className="mt-2"
        />
        {errors.examDurationMins && (
          <p className="text-red-500 text-sm mt-1">
            {errors.examDurationMins}
          </p>
        )}
      </div>

      {/* Summary */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <strong>{config.slotsPerDay}</strong> slots per day for{' '}
            <strong>{config.maxDays}</strong> days = Up to{' '}
            <strong>{config.slotsPerDay * config.maxDays}</strong> total slots
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={handleNext} className="gap-2">
          Next: Select Courses <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}