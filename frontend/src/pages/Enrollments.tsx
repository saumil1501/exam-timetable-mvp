import {
  useState,
  useCallback,
  useEffect,
} from 'react';

import {
  Plus,
  Trash2,
  AlertTriangle,
  ClipboardList,
  Users,
  BookOpen,
} from 'lucide-react';

import {
  useCourses,
} from '@/hooks/useCourses';

import {
  useStudents,
} from '@/hooks/useStudents';

import {
  useEnrollments,
} from '@/hooks/useEnrollments';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  LoadingSpinner,
} from '@/components/common/LoadingSpinner';

import {
  EmptyState,
} from '@/components/common/EmptyState';

export default function Enrollments() {

  const {
    courses,
    loading: coursesLoading,
  } = useCourses();

  const {
    students,
    loading: studentsLoading,
  } = useStudents();

  const {
    enrollments,
    loading,
    fetchEnrollments,
    createEnrollment,
    deleteEnrollment,
    getAllConflicts,
  } = useEnrollments();

  const [
    selectedStudentId,
    setSelectedStudentId,
  ] = useState('');

  const [
    selectedCourseId,
    setSelectedCourseId,
  ] = useState('');

  const [
    conflicts,
    setConflicts,
  ] = useState<any[]>([]);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const refreshConflicts =
    useCallback(async () => {
      const data =
        await getAllConflicts();

      setConflicts(data);
    }, []);

  useEffect(() => {
    refreshConflicts();
  }, []);

  const handleEnroll =
    async () => {

      if (
        !selectedStudentId ||
        !selectedCourseId
      ) {
        return;
      }

      setSubmitting(true);

      try {

        await createEnrollment(
          selectedStudentId,
          selectedCourseId
        );

        await fetchEnrollments();

        await refreshConflicts();

        setSelectedCourseId('');
        setSelectedStudentId('');

      } finally {
        setSubmitting(false);
      }
    };

  const removeEnrollment =
    async (
      enrollmentId: string
    ) => {

      if (
        !confirm(
          'Remove enrollment?'
        )
      ) {
        return;
      }

      await deleteEnrollment(
        enrollmentId
      );

      await fetchEnrollments();

      await refreshConflicts();
    };

  if (
    coursesLoading ||
    studentsLoading
  ) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          rounded-3xl
          bg-gradient-to-r
          from-teal-600
          to-emerald-700
          text-white
          p-8
        "
      >
        <h1
          className="
            text-4xl
            font-bold
          "
        >
          Enrollment Management
        </h1>

        <p
          className="
            mt-2
            text-emerald-100
          "
        >
          Manage student-course registrations and
          prepare conflict-free examination schedules.
        </p>
      </div>

      {/* SUMMARY */}

      <div
        className="
          grid
          md:grid-cols-3
          gap-4
        "
      >

        <Card>

          <CardContent className="p-6">

            <p className="text-sm text-muted-foreground">
              Students
            </p>

            <p className="mt-2 text-4xl font-bold text-blue-600">
              {students.length}
            </p>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="p-6">

            <p className="text-sm text-muted-foreground">
              Courses
            </p>

            <p className="mt-2 text-4xl font-bold text-teal-600">
              {courses.length}
            </p>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="p-6">

            <p className="text-sm text-muted-foreground">
              Enrollments
            </p>

            <p className="mt-2 text-4xl font-bold text-green-600">
              {enrollments.length}
            </p>

          </CardContent>

        </Card>

      </div>

      {/* CONFLICTS */}

      {conflicts.length > 0 && (

        <Card
          className="
            border-red-300
            bg-red-50
            dark:bg-red-950/30
          "
        >

          <CardHeader>

            <CardTitle
              className="
                flex
                items-center
                gap-2
                text-red-600
              "
            >
              <AlertTriangle className="h-5 w-5" />

              Potential Conflicts

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="space-y-2">

              {conflicts.map(
                (
                  conflict,
                  idx
                ) => (
                  <div
                    key={idx}
                    className="
                      rounded-lg
                      bg-red-100
                      dark:bg-red-900/20
                      p-3
                      text-sm
                    "
                  >
                    <strong>
                      {
                        conflict.student
                      }
                    </strong>

                    {' '}is enrolled in{' '}

                    <strong>
                      {
                        conflict.course1
                      }
                    </strong>

                    {' '}and{' '}

                    <strong>
                      {
                        conflict.course2
                      }
                    </strong>

                  </div>
                )
              )}

            </div>

          </CardContent>

        </Card>

      )}

      {/* ENROLLMENT CENTER */}

      <Card>

        <CardHeader>

          <CardTitle>
            Create Enrollment
          </CardTitle>

        </CardHeader>

        <CardContent>

          <div
            className="
              grid
              md:grid-cols-2
              gap-4
            "
          >

            <Select
              value={
                selectedStudentId
              }
              onValueChange={
                setSelectedStudentId
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>

              <SelectContent>

                {students.map(
                  (
                    student
                  ) => (
                    <SelectItem
                      key={
                        student._id
                      }
                      value={
                        student._id
                      }
                    >
                      {
                        student.studentCode
                      }

                      {' - '}

                      {
                        student.name
                      }

                    </SelectItem>
                  )
                )}

              </SelectContent>

            </Select>

            <Select
              value={
                selectedCourseId
              }
              onValueChange={
                setSelectedCourseId
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>

              <SelectContent>

                {courses.map(
                  (
                    course
                  ) => (
                    <SelectItem
                      key={
                        course._id
                      }
                      value={
                        course._id
                      }
                    >
                      {
                        course.code
                      }

                      {' - '}

                      {
                        course.name
                      }

                    </SelectItem>
                  )
                )}

              </SelectContent>

            </Select>

          </div>

          <Button
            className="
              mt-4
              w-full
            "
            onClick={
              handleEnroll
            }
            disabled={
              submitting
            }
          >
            <Plus className="mr-2 h-4 w-4" />

            {submitting
              ? 'Enrolling...'
              : 'Enroll Student'}

          </Button>

        </CardContent>

      </Card>

      {/* TABLE */}

      <Card>

        <CardHeader>

          <CardTitle>
            Enrollment Directory
          </CardTitle>

        </CardHeader>

        <CardContent className="p-0">

          {loading ? (

            <div className="py-16">
              <LoadingSpinner />
            </div>

          ) : enrollments.length === 0 ? (

            <EmptyState
              icon={
                <ClipboardList />
              }
              title="No Enrollments"
              description="Create enrollments to build your conflict graph."
            />

          ) : (

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>
                    Student
                  </TableHead>

                  <TableHead>
                    Course
                  </TableHead>

                  <TableHead>
                    Department
                  </TableHead>

                  <TableHead />

                </TableRow>

              </TableHeader>

              <TableBody>

                {enrollments.map(
                  (
                    enrollment: any
                  ) => (
                    <TableRow
                      key={
                        enrollment._id
                      }
                    >

                      <TableCell>

                        <div>

                          <p className="font-semibold">
                            {
                              enrollment
                                .studentId
                                ?.name
                            }
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {
                              enrollment
                                .studentId
                                ?.studentCode
                            }
                          </p>

                        </div>

                      </TableCell>

                      <TableCell>

                        <div>

                          <p className="font-semibold">
                            {
                              enrollment
                                .courseId
                                ?.code
                            }
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {
                              enrollment
                                .courseId
                                ?.name
                            }
                          </p>

                        </div>

                      </TableCell>

                      <TableCell>
                        {
                          enrollment
                            .courseId
                            ?.department
                        }
                      </TableCell>

                      <TableCell>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeEnrollment(
                              enrollment._id
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>

                      </TableCell>

                    </TableRow>
                  )
                )}

              </TableBody>

            </Table>

          )}

        </CardContent>

      </Card>

    </div>
  );
}