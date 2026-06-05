import { useState, useCallback } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
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
import { StudentDialog } from '@/components/students/StudentDialog';
import { DeleteStudentDialog } from '@/components/students/DeleteStudentDialog';
import { Users } from 'lucide-react';

export default function Students() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { students, loading, fetchStudents, createStudent, updateStudent, deleteStudent } =
    useStudents();

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleAddStudent = useCallback(
    async (data: any) => {
      try {
        await createStudent(data);
        setOpenDialog(false);
        await fetchStudents(page, 10, search);
      } catch (error: any) {
        console.error('Error creating student:', error.message);
      }
    },
    [createStudent, fetchStudents, page, search]
  );

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleUpdateStudent = useCallback(
    async (data: any) => {
      try {
        if (selectedStudent) {
          await updateStudent(selectedStudent._id, data);
          setOpenDialog(false);
          setSelectedStudent(null);
          setIsEditing(false);
          await fetchStudents(page, 10, search);
        }
      } catch (error: any) {
        console.error('Error updating student:', error.message);
      }
    },
    [selectedStudent, updateStudent, fetchStudents, page, search]
  );

  const handleDeleteStudent = (student: any) => {
    setSelectedStudent(student);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (selectedStudent) {
        await deleteStudent(selectedStudent._id);
        setDeleteDialog(false);
        setSelectedStudent(null);
        await fetchStudents(page, 10, search);
      }
    } catch (error: any) {
      console.error('Error deleting student:', error.message);
    }
  }, [selectedStudent, deleteStudent, fetchStudents, page, search]);

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setIsEditing(false);
  };

  const handlePageChange = useCallback(
    async (newPage: number) => {
      setPage(newPage);
      await fetchStudents(newPage, 10, search);
    },
    [fetchStudents, search]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="mt-1 text-muted-foreground">Manage your students</p>
        </div>
        <Button onClick={() => setOpenDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="flex gap-2 pt-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
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

      {/* Students Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : students.length === 0 ? (
            <EmptyState
              icon={<Users />}
              title="No students found"
              description="Start by adding your first student"
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{student.studentCode}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email || '-'}</TableCell>
                      <TableCell>{student.department || '-'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditStudent(student)}
                              className="gap-2"
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteStudent(student)}
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

      {/* Add/Edit Student Dialog */}
      <StudentDialog
        open={openDialog}
        onOpenChange={handleDialogClose}
        onSubmit={isEditing ? handleUpdateStudent : handleAddStudent}
        initialData={isEditing ? selectedStudent : undefined}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteStudentDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={handleConfirmDelete}
        student={selectedStudent}
      />
    </div>
  );
}