import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useCourses } from '@/hooks/useCourses';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CourseSelectionStepProps {
  onNext: (courseIds: string[]) => void;
  onBack: () => void;
}

export default function CourseSelectionStep({
  onNext,
  onBack,
}: CourseSelectionStepProps) {
  const { courses, loading } = useCourses();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course: any) =>
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const toggleCourse = (courseId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredCourses.length) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(filteredCourses.map((c: any) => c._id));
      setSelectedIds(allIds);
    }
  };

  const handleNext = () => {
    if (selectedIds.size > 0) {
      onNext(Array.from(selectedIds));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label htmlFor="search">Search Courses</Label>
        <Input
          id="search"
          placeholder="Search by code or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* Select All */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <Checkbox
          id="selectAll"
          checked={
            selectedIds.size === filteredCourses.length && selectedIds.size > 0
          }
          onCheckedChange={toggleAll}
        />
        <Label htmlFor="selectAll" className="cursor-pointer flex-1">
          Select All ({filteredCourses.length})
        </Label>
      </div>

      {/* Courses List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No courses found</p>
        ) : (
          filteredCourses.map((course: any) => (
            <div
              key={course._id}
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <Checkbox
                id={course._id}
                checked={selectedIds.has(course._id)}
                onCheckedChange={() => toggleCourse(course._id)}
              />
              <Label htmlFor={course._id} className="cursor-pointer flex-1">
                <div>
                  <p className="font-semibold">{course.code}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.name}
                  </p>
                </div>
              </Label>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <strong>{selectedIds.size}</strong> courses selected
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={selectedIds.size === 0} className="gap-2">
          Next: Generate <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}