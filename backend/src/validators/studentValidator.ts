import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dob: z.string().or(z.date()),
    gender: z.enum(['Male', 'Female', 'Other']),
    admissionNumber: z.string().min(1, 'Admission number is required'),
    classId: z.string().min(1, 'Class ID is required'),
    sectionId: z.string().optional(),
    parentId: z.string().optional(),
    rollNumber: z.string().optional(),
  }),
});

export const updateStudentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    dob: z.string().or(z.date()).optional(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    classId: z.string().optional(),
    sectionId: z.string().optional(),
    parentId: z.string().optional(),
    rollNumber: z.string().optional(),
  }),
});
