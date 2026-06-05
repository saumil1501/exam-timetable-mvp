import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfigStep from './wizard/ConfigStep';
import CourseSelectionStep from './wizard/CourseSelectionStep';
import GeneratingStep from './wizard/GeneratingStep';

interface GenerationWizardProps {
  onComplete?: (timetableId: string) => void;
  onCancel?: () => void;
}

export function GenerationWizard({
  onComplete,
  onCancel,
}: GenerationWizardProps) {
  const [step, setStep] = useState(1);

  const [config, setConfig] = useState({
    name: '',
    slotsPerDay: 2,
    maxDays: 10,
    examDurationMins: 180,
    breakDurationMins: 30,
    startDate: '',
    morningStartTime: '09:00',
    afternoonStartTime: '14:00',
    eveningStartTime: '18:00',
  });

  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  const handleConfigNext = (data: any) => {
    setConfig(data);
    setStep(2);
  };

  const handleCourseSelectionNext = (courseIds: string[]) => {
    setSelectedCourseIds(courseIds);
    setStep(3);
  };

  const handleGenerationComplete = (timetableId: string) => {
    if (onComplete) {
      onComplete(timetableId);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  step >= stepNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Configuration</span>
          <span>Select Courses</span>
          <span>Generate</span>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && '🔧 Configure Timetable'}
            {step === 2 && '📚 Select Courses'}
            {step === 3 && '🚀 Generate Timetable'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <ConfigStep config={config} onNext={handleConfigNext} />
          )}
          {step === 2 && (
            <CourseSelectionStep
              onNext={handleCourseSelectionNext}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <GeneratingStep
              config={config}
              courseIds={selectedCourseIds}
              onComplete={handleGenerationComplete}
              onBack={() => setStep(2)}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => (step === 1 ? onCancel?.() : setStep(step - 1))}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
        </div>
      )}
    </div>
  );
}