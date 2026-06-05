import { z } from 'zod';

// ===== COURSE SCHEMAS =====
export const createCourseSchema = z.object({
  code: z.string().min(1, 'Code required').max(20, 'Max 20 chars'),
  name: z.string().min(1, 'Name required').max(200, 'Max 200 chars'),
  department: z.string().optional(),
  credits: z.number().min(1).max(10).optional(),
  semester: z.number().min(1).max(8).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

// ===== STUDENT SCHEMAS =====
export const createStudentSchema = z.object({
  studentCode: z.string().min(1, 'Code required').max(20, 'Max 20 chars'),
  name: z.string().min(1, 'Name required').max(200, 'Max 200 chars'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  department: z.string().optional(),
  semester: z.number().min(1).max(8).optional(),
});

export const updateStudentSchema = createStudentSchema.partial();

// ===== HELPERS =====
export function validateRequest(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({
          success: false,
          error: messages.join(', '),
        });
      }
      res.status(400).json({ success: false, error: 'Validation failed' });
    }
  };
}