import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  course: any;
}

export function DeleteCourseDialog({
  open,
  onOpenChange,
  onConfirm,
  course,
}: DeleteCourseDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Course</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{course?.code}</strong>? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}