import { z } from "zod";

// Student Enrollment & Profile Schema
export const StudentSchema = z.object({
  firstName: z.string().min(2, "First name must have at least 2 characters"),
  lastName: z.string().min(1, "Last name is required"),
  admissionNumber: z.string().min(3, "Admission number is required"),
  grade: z.string().min(1, "Grade / Class is required"),
  section: z.string().min(1, "Section is required"),
  rollNumber: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"], { errorMap: () => ({ message: "Select a valid gender" }) }),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().min(2, "Mother's name is required"),
  primaryContact: z.string().min(10, "Valid 10-digit contact number required").max(15),
  address: z.string().min(5, "Address must be at least 5 characters"),
  medicalNotes: z.string().optional(),
  busRoute: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof StudentSchema>;

// Attendance Marking Schema
export const AttendanceRecordSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  status: z.enum(["Present", "Absent", "Late", "Excused"]),
  remarks: z.string().optional(),
});

export const BulkAttendanceSchema = z.object({
  date: z.string().min(1, "Date is required"),
  classId: z.string().min(1, "Class is required"),
  sectionId: z.string().min(1, "Section is required"),
  records: z.array(AttendanceRecordSchema),
});

export type BulkAttendanceFormValues = z.infer<typeof BulkAttendanceSchema>;

// Fee Collection Schema
export const FeeCollectionSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  invoiceId: z.string().optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  paymentMethod: z.enum(["Cash", "Online", "Cheque", "UPI", "Bank Transfer"]),
  transactionRef: z.string().optional(),
  remarks: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

export type FeeCollectionFormValues = z.infer<typeof FeeCollectionSchema>;

// Homework Assignment Schema
export const HomeworkSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.string().min(2, "Subject is required"),
  classId: z.string().min(1, "Class is required"),
  sectionId: z.string().min(1, "Section is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  dueDate: z.string().min(1, "Due date is required"),
  attachmentUrl: z.string().url("Invalid attachment URL").optional().or(z.literal("")),
});

export type HomeworkFormValues = z.infer<typeof HomeworkSchema>;

// Daily Diary Schema
export const DailyDiarySchema = z.object({
  classId: z.string().min(1, "Class is required"),
  sectionId: z.string().min(1, "Section is required"),
  date: z.string().min(1, "Date is required"),
  todayLearning: z.string().min(5, "Learning summary is required"),
  todayActivity: z.string().optional(),
  specialNote: z.string().optional(),
});

export type DailyDiaryFormValues = z.infer<typeof DailyDiarySchema>;

// Admissions Application Schema
export const AdmissionApplicationSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  applyingForGrade: z.string().min(1, "Grade is required"),
  parentName: z.string().min(2, "Parent name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  previousSchool: z.string().optional(),
  dateOfBirth: z.string().optional(),
  notes: z.string().optional(),
});

export type AdmissionApplicationFormValues = z.infer<typeof AdmissionApplicationSchema>;
