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

const courseSchema = z.object({
  code: z.string().min(1, 'Code required').max(20),
  name: z.string().min(1, 'Name required').max(200),
  department: z.string().optional(),
  credits: z.number().min(1).max(10).optional(),
  semester: z.number().min(1).max(8).optional(),
});

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isEditing?: boolean;
}

export function CourseDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing,
}: CourseDialogProps) {
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: '',
      name: '',
      department: '',
      credits: undefined,
      semester: undefined,
    },
  });

  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        code: initialData.code,
        name: initialData.name,
        department: initialData.department,
        credits: initialData.credits,
        semester: initialData.semester,
      });
    } else {
      form.reset({
        code: '',
        name: '',
        department: '',
        credits: undefined,
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
          <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update course details' : 'Create a new course'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="CS101" disabled={isEditing} {...field} />
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
                  <FormLabel>Course Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Data Structures" {...field} />
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
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      placeholder="3"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
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