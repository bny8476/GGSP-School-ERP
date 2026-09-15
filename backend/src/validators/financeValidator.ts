import { z } from 'zod';

export const createFeeSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    title: z.string().min(1, 'Fee title is required'),
    amount: z.number().positive('Fee amount must be greater than 0'),
    dueDate: z.string().or(z.date()),
    category: z.string().optional(),
  }),
});

export const createExpenseSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Expense title is required'),
    category: z.string().min(1, 'Category is required'),
    amount: z.number().positive('Expense amount must be greater than 0'),
    date: z.string().or(z.date()).optional(),
    description: z.string().optional(),
  }),
});
