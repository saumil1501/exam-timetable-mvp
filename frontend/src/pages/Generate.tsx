import { useState } from 'react';
import { GenerationWizard } from '@/components/timetable/GenerationWizard';
import { useNavigate } from 'react-router-dom';

export default function Generate() {
  const navigate = useNavigate();

  const handleComplete = (timetableId: string) => {
    navigate(`/timetables/${timetableId}`);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Timetable</h1>
        <p className="mt-1 text-muted-foreground">
          Create a conflict-free exam schedule in 3 simple steps
        </p>
      </div>

      <GenerationWizard onComplete={handleComplete} onCancel={handleCancel} />
    </div>
  );
}