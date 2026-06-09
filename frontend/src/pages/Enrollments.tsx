import { useState, useEffect } from 'react';
import {
  Trash2,
  AlertTriangle,
  CheckSquare,
  Square,
  Users,
  BookOpen,
  X,
  CheckCircle2,
  ClipboardList,
  Link2,
} from 'lucide-react';

import { useCourses } from '@/hooks/useCourses';
import { useStudents } from '@/hooks/useStudents';
import { useEnrollments } from '@/hooks/useEnrollments';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/common/EmptyState';

export default function Enrollments() {
  const { courses } = useCourses();
  const { students } = useStudents();
  const {
    enrollments,
    fetchEnrollments,
    bulkCreateEnrollments,
    deleteEnrollment,
    getAllConflicts,
  } = useEnrollments();

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    refreshConflicts();
  }, []);

  const refreshConflicts = async () => {
    try {
      const data = await getAllConflicts();
      setConflicts(data || []);
    } catch (err) {
      console.error('Failed to fetch conflicts:', err);
      setConflicts([]);
    }
  };

  const toggleStudent = (id: string) =>
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  const toggleCourse = (id: string) =>
    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );

  const toggleAllStudents = () =>
    setSelectedStudents(
      selectedStudents.length === students.length ? [] : students.map(s => s._id)
    );

  const toggleAllCourses = () =>
    setSelectedCourses(
      selectedCourses.length === courses.length ? [] : courses.map(c => c._id)
    );

  const duplicateEnrollments = selectedStudents.flatMap(studentId =>
    selectedCourses
      .filter(courseId =>
        enrollments.some(
          e =>
            (e.studentId?._id || e.studentId) === studentId &&
            (e.courseId?._id || e.courseId) === courseId
        )
      )
      .map(courseId => ({ studentId, courseId }))
  );

  const potentialNewConflicts = selectedStudents.flatMap(studentId => {
    const currentCourses = enrollments
      .filter(e => (e.studentId?._id || e.studentId) === studentId)
      .map(e => e.courseId?._id || e.courseId);

    const allCourses = new Set([...currentCourses, ...selectedCourses]);

    if (allCourses.size > 1) {
      const student = students.find(s => s._id === studentId);
      return [{
        studentId,
        studentName: student?.name || 'Unknown',
        totalCourses: allCourses.size,
      }];
    }
    return [];
  });

  const relevantExistingConflicts = conflicts.filter(c =>
    selectedStudents.includes(c.studentId) ||
    selectedCourses.includes(c.course1Id) ||
    selectedCourses.includes(c.course2Id)
  );

  const totalAttempted = selectedStudents.length * selectedCourses.length;
  const newEnrollments = totalAttempted - duplicateEnrollments.length;

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this enrollment?')) return;
    try {
      setDeletingId(id);
      await deleteEnrollment(id);
      await fetchEnrollments();
      await refreshConflicts();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete enrollment');
    } finally {
      setDeletingId(null);
    }
  };

  const enroll = async () => {
    const enrollmentsToCreate = selectedStudents.flatMap(studentId =>
      selectedCourses.map(courseId => ({ studentId, courseId }))
    );

    try {
      setSubmitting(true);
      await bulkCreateEnrollments(enrollmentsToCreate);
      await fetchEnrollments();
      await refreshConflicts();
      setSelectedCourses([]);
      setSelectedStudents([]);
      setPreviewOpen(false);
    } catch (err) {
      console.error('Enrollment failed:', err);
      alert('Failed to create enrollments');
    } finally {
      setSubmitting(false);
    }
  };

  const allStudentsSelected =
    students.length > 0 && selectedStudents.length === students.length;
  const allCoursesSelected =
    courses.length > 0 && selectedCourses.length === courses.length;

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-purple-700 text-white p-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center">
            <ClipboardList className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Manage Enrollments</h1>
            <p className="mt-2 text-violet-100">
              Bulk enroll students into courses and detect scheduling conflicts.
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY + ACTION */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* STAT 1 */}
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Enrollments</p>
            <p className="mt-2 text-4xl font-bold text-violet-600">
              {enrollments.length}
            </p>
          </CardContent>
        </Card>

        {/* STAT 2 */}
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Active Conflicts</p>
            <p
              className={`mt-2 text-4xl font-bold ${
                conflicts.length > 0 ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {conflicts.length}
            </p>
          </CardContent>
        </Card>

        {/* ACTION CARD */}
        <Card className="flex flex-col">
          <CardContent className="p-6 flex flex-col justify-center h-full gap-3">
            
            <Button
              className="w-full h-full gap-2"
              disabled={
                selectedStudents.length === 0 || selectedCourses.length === 0
              }
              onClick={() => setPreviewOpen(true)}
            >
              <Link2 className="h-4 w-4" />
              Preview Enrollment ({totalAttempted})
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* GLOBAL CONFLICTS BANNER */}
      {conflicts.length > 0 && (
        <Card className="border-red-300 bg-red-50 dark:bg-red-900/20">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold">
              <AlertTriangle className="h-5 w-5" />
              {conflicts.length} existing conflict
              {conflicts.length > 1 ? 's' : ''} in the system
            </div>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
              Students enrolled in multiple courses (potential exam clashes).
            </p>
          </CardContent>
        </Card>
      )}

      {/* BULK SELECTION */}
      <Card>
        <CardHeader>
          <CardTitle >Bulk Enrollment</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* STUDENTS */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Select Students
                  <span className="text-xs text-muted-foreground font-normal">
                    ({selectedStudents.length}/{students.length})
                  </span>
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleAllStudents}
                  className="h-7 text-xs"
                >
                  {allStudentsSelected ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 border rounded-lg p-2">
                {students.map(student => {
                  const checked = selectedStudents.includes(student._id);
                  return (
                    <div
                      key={student._id}
                      onClick={() => toggleStudent(student._id)}
                      className={`cursor-pointer flex items-center gap-3 p-2 rounded-md transition-colors duration-150 ${
                        checked ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm">
                        <span className="font-medium">{student.studentCode}</span>
                        {' — '}
                        {student.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COURSES */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Select Courses
                  <span className="text-xs text-muted-foreground font-normal">
                    ({selectedCourses.length}/{courses.length})
                  </span>
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleAllCourses}
                  className="h-7 text-xs"
                >
                  {allCoursesSelected ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 border rounded-lg p-2">
                {courses.map(course => {
                  const checked = selectedCourses.includes(course._id);
                  return (
                    <div
                      key={course._id}
                      onClick={() => toggleCourse(course._id)}
                      className={`cursor-pointer flex items-center gap-3 p-2 rounded-md transition-colors duration-150 ${
                        checked ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm">
                        <span className="font-medium">{course.code}</span>
                        {' — '}
                        {course.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PREVIEW MODAL */}
      {previewOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !submitting && setPreviewOpen(false)}
        >
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-primary"
            onClick={e => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Enrollment Preview</CardTitle>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setPreviewOpen(false)}
                disabled={submitting}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{selectedStudents.length}</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{selectedCourses.length}</div>
                  <div className="text-xs text-muted-foreground">Courses</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">
                    {newEnrollments}
                  </div>
                  <div className="text-xs text-muted-foreground">New</div>
                </div>
              </div>

              {duplicateEnrollments.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    {duplicateEnrollments.length} duplicate
                    {duplicateEnrollments.length > 1 ? 's' : ''} will be skipped
                  </div>
                </div>
              )}

              {relevantExistingConflicts.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    {relevantExistingConflicts.length} existing conflict
                    {relevantExistingConflicts.length > 1 ? 's' : ''} involve your selection
                  </div>
                  <ul className="text-xs space-y-1 max-h-32 overflow-y-auto pl-2">
                    {relevantExistingConflicts.slice(0, 5).map((c, i) => (
                      <li key={i} className="text-red-700 dark:text-red-300">
                        • <strong>{c.student}</strong>: {c.course1} ⚡ {c.course2}
                      </li>
                    ))}
                    {relevantExistingConflicts.length > 5 && (
                      <li className="text-muted-foreground italic">
                        ...and {relevantExistingConflicts.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {potentialNewConflicts.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-semibold mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    {potentialNewConflicts.length} student
                    {potentialNewConflicts.length > 1 ? 's' : ''} will have multiple courses
                  </div>
                  <p className="text-xs text-orange-700/80 dark:text-orange-400/80">
                    These students may face exam scheduling clashes after enrollment.
                  </p>
                </div>
              )}

              {relevantExistingConflicts.length === 0 &&
                potentialNewConflicts.length === 0 &&
                duplicateEnrollments.length === 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      No conflicts detected
                    </div>
                  </div>
                )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPreviewOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={submitting || newEnrollments === 0}
                  variant={
                    relevantExistingConflicts.length > 0 ||
                    potentialNewConflicts.length > 0
                      ? 'destructive'
                      : 'default'
                  }
                  onClick={enroll}
                >
                  {submitting
                    ? 'Enrolling...'
                    : relevantExistingConflicts.length > 0 ||
                      potentialNewConflicts.length > 0
                    ? 'Confirm Anyway'
                    : `Confirm ${newEnrollments} Enrollment${
                        newEnrollments !== 1 ? 's' : ''
                      }`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ENROLLMENT DIRECTORY */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Directory</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {enrollments.length === 0 ? (
            <EmptyState
              icon={<ClipboardList />}
              title="No Enrollments Yet"
              description="Select students and courses above to start enrolling."
            />
          ) : (
            <div className="divide-y">
              {enrollments.map(enrollment => (
                <div
                  key={enrollment._id}
                  className="flex justify-between items-center p-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <Link2 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {enrollment.studentId?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {enrollment.studentId?.studentCode} →{' '}
                        <span className="font-medium">
                          {enrollment.courseId?.code}
                        </span>
                        {' — '}
                        {enrollment.courseId?.name}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={deletingId === enrollment._id}
                    onClick={() => handleDelete(enrollment._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}