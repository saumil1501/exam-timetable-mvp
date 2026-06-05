import { useState, useCallback } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { BookOpen } from 'lucide-react';

export default function Courses() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { courses, loading, fetchCourses, createCourse, updateCourse, deleteCourse } =
    useCourses();

  // Handle search
  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  // Handle add course
  const handleAddCourse = useCallback(
    async (data: any) => {
      try {
        await createCourse(data);
        setOpenDialog(false);
        await fetchCourses(page, 10, search);
      } catch (error: any) {
        console.error('Error creating course:', error.message);
      }
    },
    [createCourse, fetchCourses, page, search]
  );

  // Handle edit course
  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Handle update course
  const handleUpdateCourse = useCallback(
    async (data: any) => {
      try {
        if (selectedCourse) {
          await updateCourse(selectedCourse._id, data);
          setOpenDialog(false);
          setSelectedCourse(null);
          setIsEditing(false);
          await fetchCourses(page, 10, search);
        }
      } catch (error: any) {
        console.error('Error updating course:', error.message);
      }
    },
    [selectedCourse, updateCourse, fetchCourses, page, search]
  );

  // Handle delete course
  const handleDeleteCourse = (course: any) => {
    setSelectedCourse(course);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (selectedCourse) {
        await deleteCourse(selectedCourse._id);
        setDeleteDialog(false);
        setSelectedCourse(null);
        await fetchCourses(page, 10, search);
      }
    } catch (error: any) {
      console.error('Error deleting course:', error.message);
    }
  }, [selectedCourse, deleteCourse, fetchCourses, page, search]);

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
    setIsEditing(false);
  };

  // Handle page change
  const handlePageChange = useCallback(
    async (newPage: number) => {
      setPage(newPage);
      await fetchCourses(newPage, 10, search);
    },
    [fetchCourses, search]
  );

  // Refetch when search changes
  const refetchWithSearch = useCallback(async () => {
    setPage(1);
    await fetchCourses(1, 10, search);
  }, [fetchCourses, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="mt-1 text-muted-foreground">Manage your courses</p>
        </div>
        <Button onClick={() => setOpenDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="flex gap-2 pt-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" onClick={handleSearch}>
            Search
          </Button>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : courses.length === 0 ? (
            <EmptyState
              icon={<BookOpen />}
              title="No courses found"
              description="Start by adding your first course"
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
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.department || '-'}</TableCell>
                      <TableCell>{course.credits || '-'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditCourse(course)}
                              className="gap-2"
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCourse(course)}
                              className="gap-2 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DataTablePagination page={page} pages={1} onPageChange={handlePageChange} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Course Dialog */}
      <CourseDialog
        open={openDialog}
        onOpenChange={handleDialogClose}
        onSubmit={isEditing ? handleUpdateCourse : handleAddCourse}
        initialData={isEditing ? selectedCourse : undefined}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCourseDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={handleConfirmDelete}
        course={selectedCourse}
      />
    </div>
  );
}