import { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useStudents } from '@/hooks/useStudents';
import { useEnrollments } from '@/hooks/useEnrollments';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ClipboardList } from 'lucide-react';

export default function Enrollments() {
  const { courses, loading: coursesLoading } = useCourses();
  const { students, loading: studentsLoading } = useStudents();
  const {
    enrollments,
    loading: enrollmentsLoading,
    fetchEnrollments,
    createEnrollment,
    deleteEnrollment,
    getAllConflicts,
  } = useEnrollments();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);

  // Refresh conflicts
  const refreshConflicts = useCallback(async () => {
    try {
      const data = await getAllConflicts();
      setConflicts(data);
    } catch (error) {
      console.error('Error fetching conflicts:', error);
    }
  }, [getAllConflicts]);

  // Load conflicts on mount
  useEffect(() => {
    refreshConflicts();
  }, [refreshConflicts]);

  // Handle enrollment creation
  const handleEnroll = useCallback(async () => {
    if (!selectedStudentId || !selectedCourseId) {
      alert('Please select both student and course');
      return;
    }

    setSubmitting(true);
    try {
      await createEnrollment(selectedStudentId, selectedCourseId);
      await fetchEnrollments();
      setSelectedStudentId('');
      setSelectedCourseId('');
      await refreshConflicts();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  }, [selectedStudentId, selectedCourseId, createEnrollment, fetchEnrollments, refreshConflicts]);

  // Handle enrollment deletion
  const handleDeleteEnrollment = useCallback(
    async (enrollmentId: string) => {
      if (confirm('Delete this enrollment?')) {
        try {
          await deleteEnrollment(enrollmentId);
          await fetchEnrollments();
          await refreshConflicts();
        } catch (error: any) {
          alert('Error: ' + error.message);
        }
      }
    },
    [deleteEnrollment, fetchEnrollments, refreshConflicts]
  );

  const selectedStudent = students.find((s) => s._id === selectedStudentId);
  const selectedCourse = courses.find((c) => c._id === selectedCourseId);

  if (coursesLoading || studentsLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enrollments</h1>
        <p className="mt-1 text-muted-foreground">
          Manage student course enrollments
        </p>
      </div>

      {/* Enrollment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Enroll Student in Course
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Select */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Student *
              </label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student._id} value={student._id}>
                      {student.studentCode} - {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course Select */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Course *
              </label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          {selectedStudent && selectedCourse && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold">{selectedStudent.name}</span> will be
                enrolled in{' '}
                <span className="font-semibold">
                  {selectedCourse.code}
                </span>
              </p>
            </div>
          )}

          <Button
            onClick={handleEnroll}
            disabled={submitting || !selectedStudentId || !selectedCourseId}
            className="w-full md:w-auto"
          >
            {submitting ? 'Enrolling...' : 'Enroll Student'}
          </Button>
        </CardContent>
      </Card>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              {conflicts.length} Potential Conflict{conflicts.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conflicts.map((conflict, idx) => (
                <div
                  key={idx}
                  className="text-sm text-red-700 dark:text-red-300 p-2 bg-red-100 dark:bg-red-900/30 rounded"
                >
                  <strong>{conflict.student}</strong> is enrolled in both{' '}
                  <strong>{conflict.course1}</strong> and{' '}
                  <strong>{conflict.course2}</strong>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enrollments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            All Enrollments ({enrollments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {enrollmentsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : enrollments.length === 0 ? (
            <EmptyState
              icon={<ClipboardList />}
              title="No enrollments yet"
              description="Start by enrolling students in courses"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment: any) => (
                  <TableRow key={enrollment._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">
                          {enrollment.studentId?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.studentId?.studentCode}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">
                          {enrollment.courseId?.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.courseId?.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{enrollment.courseId?.department || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEnrollment(enrollment._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}