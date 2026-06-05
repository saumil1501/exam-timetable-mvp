import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const studentSchema = z.object({
  studentCode: z.string().min(1, 'Code required').max(20),
  name: z.string().min(1, 'Name required').max(200),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  department: z.string().optional(),
  semester: z.number().min(1).max(8).optional(),
});

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isEditing?: boolean;
}

export function StudentDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing,
}: StudentDialogProps) {
  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentCode: '',
      name: '',
      email: '',
      department: '',
      semester: undefined,
    },
  });

  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        studentCode: initialData.studentCode,
        name: initialData.name,
        email: initialData.email,
        department: initialData.department,
        semester: initialData.semester,
      });
    } else {
      form.reset({
        studentCode: '',
        name: '',
        email: '',
        department: '',
        semester: undefined,
      });
    }
  }, [initialData, isEditing, form]);

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update student details' : 'Create a new student'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="STU001" disabled={isEditing} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={8}
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}