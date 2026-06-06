import {
  useState,
  useCallback,
} from 'react';

import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Users,
  GraduationCap,
  Mail,
} from 'lucide-react';

import { useStudents } from '@/hooks/useStudents';

import {
  Button,
} from '@/components/ui/button';

import {
  Input,
} from '@/components/ui/input';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  LoadingSpinner,
} from '@/components/common/LoadingSpinner';

import {
  EmptyState,
} from '@/components/common/EmptyState';

import {
  DataTablePagination,
} from '@/components/common/DataTablePagination';

import {
  StudentDialog,
} from '@/components/students/StudentDialog';

import {
  DeleteStudentDialog,
} from '@/components/students/DeleteStudentDialog';

export default function Students() {

  const [page, setPage] =
    useState(1);

  const [search, setSearch] =
    useState('');

  const [searchInput, setSearchInput] =
    useState('');

  const [openDialog, setOpenDialog] =
    useState(false);

  const [deleteDialog, setDeleteDialog] =
    useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState<any>(null);

  const [isEditing, setIsEditing] =
    useState(false);

  const {
    students,
    loading,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudents();

  const handleSearch =
    useCallback(() => {
      setSearch(searchInput);
      setPage(1);
    }, [searchInput]);

  const handleAddStudent =
    useCallback(
      async (data: any) => {

        await createStudent(data);

        setOpenDialog(false);

        fetchStudents(
          page,
          10,
          search
        );
      },
      [
        createStudent,
        fetchStudents,
        page,
        search,
      ]
    );

  const handleEditStudent =
    (
      student: any
    ) => {
      setSelectedStudent(student);
      setIsEditing(true);
      setOpenDialog(true);
    };

  const handleUpdateStudent =
    useCallback(
      async (data: any) => {

        if (!selectedStudent)
          return;

        await updateStudent(
          selectedStudent._id,
          data
        );

        setSelectedStudent(
          null
        );

        setOpenDialog(false);

        setIsEditing(false);

        fetchStudents(
          page,
          10,
          search
        );
      },
      [
        selectedStudent,
        updateStudent,
        fetchStudents,
        page,
        search,
      ]
    );

  const handleDeleteStudent =
    (
      student: any
    ) => {
      setSelectedStudent(student);
      setDeleteDialog(true);
    };

  const confirmDelete =
    async () => {

      if (!selectedStudent)
        return;

      await deleteStudent(
        selectedStudent._id
      );

      setDeleteDialog(false);

      fetchStudents(
        page,
        10,
        search
      );
    };

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          rounded-3xl
          bg-gradient-to-r
          from-teal-600
          to-cyan-700
          text-white
          p-8
        "
      >
        <div className="flex items-center gap-4">

          <div
            className="
              h-16
              w-16
              rounded-2xl
              bg-white/10
              flex
              items-center
              justify-center
            "
          >
            <Users className="h-8 w-8" />
          </div>

          <div>

            <h1
              className="
                text-4xl
                font-bold
              "
            >
              Manage Students
            </h1>

            <p
              className="
                mt-2
                text-cyan-100
              "
            >
              Manage students,
              registrations and
              academic records.
            </p>

          </div>

        </div>
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

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              Total Students
            </p>

            <p
              className="
                mt-2
                text-4xl
                font-bold
                text-teal-600
              "
            >
              {students.length}
            </p>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="p-6">

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              Registered Emails
            </p>

            <p
              className="
                mt-2
                text-4xl
                font-bold
                text-cyan-600
              "
            >
              {
                students.filter(
                  (s: any) =>
                    s.email
                ).length
              }
            </p>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="p-6">

            <Button
              onClick={() =>
                setOpenDialog(
                  true
                )
              }
              className="
                w-full
                h-full
              "
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>

          </CardContent>

        </Card>

      </div>

      {/* SEARCH */}

      <Card>

        <CardHeader>

          <CardTitle>
            Search Students
          </CardTitle>

        </CardHeader>

        <CardContent>

          <div className="flex gap-3">

            <div className="relative flex-1">

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <Input
                value={
                  searchInput
                }
                onChange={(
                  e
                ) =>
                  setSearchInput(
                    e.target
                      .value
                  )
                }
                placeholder="Search by code, name or email..."
                className="pl-10"
              />

            </div>

            <Button
              onClick={
                handleSearch
              }
            >
              Search
            </Button>

          </div>

        </CardContent>

      </Card>

      {/* DIRECTORY */}

      <Card>

        <CardHeader>

          <CardTitle>
            Student Directory
          </CardTitle>

        </CardHeader>

        <CardContent className="p-0">

          {loading ? (
            <div className="py-16">
              <LoadingSpinner />
            </div>
          ) : students.length ===
            0 ? (
            <EmptyState
              icon={
                <GraduationCap />
              }
              title="No Students Found"
              description="Add students to begin enrollment management."
            />
          ) : (
            <>
              <Table>

                <TableHeader>

                  <TableRow>

                    <TableHead>
                      Student ID
                    </TableHead>

                    <TableHead>
                      Name
                    </TableHead>

                    <TableHead>
                      Email
                    </TableHead>

                    <TableHead>
                      Department
                    </TableHead>

                    <TableHead />

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {students.map(
                    (
                      student
                    ) => (
                      <TableRow
                        key={
                          student._id
                        }
                      >

                        <TableCell className="font-semibold">
                          {
                            student.studentCode
                          }
                        </TableCell>

                        <TableCell>
                          {
                            student.name
                          }
                        </TableCell>

                        <TableCell>

                          <div className="flex items-center gap-2">

                            <Mail className="h-4 w-4 text-muted-foreground" />

                            {student.email ||
                              '-'}

                          </div>

                        </TableCell>

                        <TableCell>
                          {
                            student.department ||
                            '-'
                          }
                        </TableCell>

                        <TableCell>

                          <DropdownMenu>

                            <DropdownMenuTrigger
                              asChild
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>

                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditStudent(
                                    student
                                  )
                                }
                              >
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteStudent(
                                    student
                                  )
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                Delete
                              </DropdownMenuItem>

                            </DropdownMenuContent>

                          </DropdownMenu>

                        </TableCell>

                      </TableRow>
                    )
                  )}

                </TableBody>

              </Table>

              <DataTablePagination
                page={page}
                pages={1}
                onPageChange={
                  setPage
                }
              />

            </>
          )}

        </CardContent>

      </Card>

      <StudentDialog
        open={openDialog}
        onOpenChange={() =>
          setOpenDialog(
            false
          )
        }
        onSubmit={
          isEditing
            ? handleUpdateStudent
            : handleAddStudent
        }
        initialData={
          selectedStudent
        }
        isEditing={
          isEditing
        }
      />

      <DeleteStudentDialog
        open={
          deleteDialog
        }
        onOpenChange={
          setDeleteDialog
        }
        onConfirm={
          confirmDelete
        }
        student={
          selectedStudent
        }
      />

    </div>
  );
}