import { z } from 'zod';

export const markAttendanceSchema = z.object({
  body: z.object({
    date: z.string().or(z.date()),
    classId: z.string().min(1, 'Class ID is required'),
    sectionId: z.string().optional(),
    records: z.array(
      z.object({
        studentId: z.string().min(1, 'Student ID is required'),
        status: z.enum(['Present', 'Absent', 'Late', 'Excused']),
        remarks: z.string().optional(),
      })
    ).min(1, 'At least one student attendance record is required'),
  }),
});
