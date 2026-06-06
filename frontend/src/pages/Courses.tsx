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
  BookOpen,
  GraduationCap,
} from 'lucide-react';

import { useCourses } from '@/hooks/useCourses';

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
  CourseDialog,
} from '@/components/courses/CourseDialog';

import {
  DeleteCourseDialog,
} from '@/components/courses/DeleteCourseDialog';

export default function Courses() {

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

  const [selectedCourse, setSelectedCourse] =
    useState<any>(null);

  const [isEditing, setIsEditing] =
    useState(false);

  const {
    courses,
    loading,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCourses();

  const handleSearch =
    useCallback(() => {
      setSearch(searchInput);
      setPage(1);
    }, [searchInput]);

  const handleAddCourse =
    useCallback(
      async (data: any) => {
        await createCourse(data);
        setOpenDialog(false);
        fetchCourses(
          page,
          10,
          search
        );
      },
      [
        createCourse,
        fetchCourses,
        page,
        search,
      ]
    );

  const handleEditCourse = (
    course: any
  ) => {
    setSelectedCourse(course);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleUpdateCourse =
    useCallback(
      async (data: any) => {
        if (!selectedCourse)
          return;

        await updateCourse(
          selectedCourse._id,
          data
        );

        setOpenDialog(false);

        setSelectedCourse(null);

        setIsEditing(false);

        fetchCourses(
          page,
          10,
          search
        );
      },
      [
        selectedCourse,
        updateCourse,
        fetchCourses,
        page,
        search,
      ]
    );

  const handleDeleteCourse =
    (
      course: any
    ) => {
      setSelectedCourse(course);
      setDeleteDialog(true);
    };

  const confirmDelete =
    async () => {
      if (!selectedCourse)
        return;

      await deleteCourse(
        selectedCourse._id
      );

      setDeleteDialog(false);

      fetchCourses(
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
          from-primary
          to-blue-700
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
            <GraduationCap className="h-8 w-8" />
          </div>

          <div>

            <h1
              className="
                text-4xl
                font-bold
              "
            >
              Manage Courses
            </h1>

            <p
              className="
                mt-2
                text-blue-100
              "
            >
              Manage university courses,
              departments and examination
              subjects.
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
              Total Courses
            </p>

            <p
              className="
                mt-2
                text-4xl
                font-bold
                text-primary
              "
            >
              {courses.length}
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
              Departments
            </p>

            <p
              className="
                mt-2
                text-4xl
                font-bold
                text-teal-500
              "
            >
              {
                new Set(
                  courses.map(
                    (c: any) =>
                      c.department
                  )
                ).size
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2">
            <Button
              onClick={() =>
                setOpenDialog(
                  true
                )
              }
              className="w-full gap-2 justify-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* SEARCH */}

      <Card>

        <CardHeader>

          <CardTitle>
            Search Courses
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
                placeholder="Search by code, name or department..."
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

      {/* TABLE */}

      <Card>

        <CardHeader>

          <CardTitle>
            Course Catalogue
          </CardTitle>

        </CardHeader>

        <CardContent className="p-0">

          {loading ? (
            <div className="py-16">
              <LoadingSpinner />
            </div>
          ) : courses.length ===
            0 ? (
            <EmptyState
              icon={
                <BookOpen />
              }
              title="No Courses Found"
              description="Create your first course."
            />
          ) : (
            <>
              <Table>

                <TableHeader>

                  <TableRow>

                    <TableHead>
                      Code
                    </TableHead>

                    <TableHead>
                      Name
                    </TableHead>

                    <TableHead>
                      Department
                    </TableHead>

                    <TableHead>
                      Credits
                    </TableHead>

                    <TableHead />

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {courses.map(
                    (
                      course
                    ) => (
                      <TableRow
                        key={
                          course._id
                        }
                      >
                        <TableCell className="font-semibold">
                          {
                            course.code
                          }
                        </TableCell>

                        <TableCell>
                          {
                            course.name
                          }
                        </TableCell>

                        <TableCell>
                          {
                            course.department
                          }
                        </TableCell>

                        <TableCell>
                          {
                            course.credits
                          }
                        </TableCell>

                        <TableCell>

                          <DropdownMenu>

                            <DropdownMenuTrigger
                              asChild
                            >
                              <Button
                                size="icon"
                                variant="ghost"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>

                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditCourse(
                                    course
                                  )
                                }
                              >
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteCourse(
                                    course
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

      <CourseDialog
        open={openDialog}
        onOpenChange={() =>
          setOpenDialog(
            false
          )
        }
        onSubmit={
          isEditing
            ? handleUpdateCourse
            : handleAddCourse
        }
        initialData={
          selectedCourse
        }
        isEditing={
          isEditing
        }
      />

      <DeleteCourseDialog
        open={
          deleteDialog
        }
        onOpenChange={
          setDeleteDialog
        }
        onConfirm={
          confirmDelete
        }
        course={
          selectedCourse
        }
      />

    </div>
  );
}