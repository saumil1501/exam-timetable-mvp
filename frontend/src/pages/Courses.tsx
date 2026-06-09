import { useState, useEffect } from 'react';

import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  BookOpen,
  GraduationCap,
  Building2,
} from 'lucide-react';

import { useCourses } from '@/hooks/useCourses';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { DataTablePagination } from '@/components/common/DataTablePagination';

import { CourseDialog } from '@/components/courses/CourseDialog';
import { DeleteCourseDialog } from '@/components/courses/DeleteCourseDialog';

export default function Courses() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    courses,
    loading,
    fetchCourses,
    pages,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCourses();

  useEffect(() => {
    fetchCourses(page, 10, search);
  }, [page, search]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleOpenAdd = () => {
    setSelectedCourse(null);
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleAddCourse = async (data: any) => {
    await createCourse(data);
    setOpenDialog(false);
    fetchCourses(page, 10, search);
  };

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleUpdateCourse = async (data: any) => {
    if (!selectedCourse) return;
    await updateCourse(selectedCourse._id, data);
    setOpenDialog(false);
    setSelectedCourse(null);
    setIsEditing(false);
    fetchCourses(page, 10, search);
  };

  const handleDeleteCourse = (course: any) => {
    setSelectedCourse(course);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;
    await deleteCourse(selectedCourse._id);
    setDeleteDialog(false);
    fetchCourses(page, 10, search);
  };

  const handleDialogClose = (open: boolean) => {
    setOpenDialog(open);
    if (!open) {
      setIsEditing(false);
      setSelectedCourse(null);
    }
  };

  // Derived stats
  const uniqueDepartments = new Set(
    courses.map((c: any) => c.department).filter(Boolean)
  ).size;

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl bg-gradient-to-r from-primary to-blue-700 text-white p-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Manage Courses</h1>
            <p className="mt-2 text-blue-100">
              Manage university courses and subjects.
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY + ACTION */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* STAT 1 */}
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Courses</p>
            <p className="mt-2 text-4xl font-bold text-primary">
              {courses.length}
            </p>
          </CardContent>
        </Card>

        {/* STAT 2 */}
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Departments</p>
            <p className="mt-2 text-4xl font-bold text-blue-600">
              {uniqueDepartments}
            </p>
          </CardContent>
        </Card>

        {/* ACTION CARD */}
        <Card className="flex flex-col">
          <CardContent className="p-6 flex flex-col justify-center h-full gap-3">
            
            <Button onClick={handleOpenAdd} className="w-full h-full gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH */}
      <Card>
        <CardHeader>
          <CardTitle>Search Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by code, name or department..."
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* DIRECTORY */}
      <Card>
        <CardHeader>
          <CardTitle>Course Catalogue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16">
              <LoadingSpinner />
            </div>
          ) : courses.length === 0 ? (
            <EmptyState
              icon={<BookOpen />}
              title="No Courses Found"
              description="Create your first course."
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-semibold">
                        {course.code}
                      </TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {course.department || '-'}
                        </div>
                      </TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCourse(course)}
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <DataTablePagination
                page={page}
                pages={pages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </>
          )}
        </CardContent>
      </Card>

      <CourseDialog
        open={openDialog}
        onOpenChange={handleDialogClose}
        onSubmit={isEditing ? handleUpdateCourse : handleAddCourse}
        initialData={selectedCourse}
        isEditing={isEditing}
      />

      <DeleteCourseDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={confirmDelete}
        course={selectedCourse}
      />
    </div>
  );
}