import mongoose from 'mongoose';
import Counter from '../models/Counter';

const inMemoryCounters = new Map<string, number>();

/**
 * Atomic counter incrementer:
 * Uses MongoDB findOneAndUpdate with returnDocument: 'after' and optional ClientSession.
 * Resiliently falls back to synchronized in-memory counter when MongoDB is disconnected (e.g. offline testing).
 */
async function getNextSequence(key: string, session?: mongoose.ClientSession): Promise<number> {
  if (mongoose.connection.readyState === 1) {
    const counter = await Counter.findOneAndUpdate(
      { key },
      { $inc: { sequence: 1 } },
      { upsert: true, returnDocument: 'after', session }
    );
    return counter ? counter.sequence : 1;
  }

  const current = inMemoryCounters.get(key) || 0;
  const next = current + 1;
  inMemoryCounters.set(key, next);
  return next;
}

/**
 * Normalizes an academic year string to 4-digit start year (e.g. "2026-27" -> "2026").
 */
export function normalizeAcademicYear(rawYear?: string): string {
  if (!rawYear) return new Date().getFullYear().toString();
  const match = rawYear.match(/\b(20\d{2})\b/);
  return match ? match[1] : new Date().getFullYear().toString();
}

/**
 * Normalizes a class/grade string into uppercase standard identifier
 * (e.g. "Pre-KG" -> "PREKG", "LKG - Section A" -> "LKG", "UKG" -> "UKG").
 */
export function normalizeClassName(rawClass?: string): string {
  if (!rawClass) return 'LKG';
  const cleaned = rawClass
    .replace(/section\s+[a-z0-9]+/i, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
  return cleaned || 'LKG';
}

/**
 * Normalizes section name (e.g. "Section A" -> "A", "sec-b" -> "B").
 */
export function normalizeSectionName(rawSection?: string): string {
  if (!rawSection) return 'A';
  const match = rawSection.match(/([a-zA-Z0-9]+)$/);
  return match ? match[1].toUpperCase() : 'A';
}

/**
 * Concurrency-safe atomic generation of Student ID:
 * Format: GGPS-{ACADEMIC_YEAR}-{CLASS}-{SEQUENCE}
 * Example: GGPS-2026-LKG-001
 */
export async function generateNextStudentID(
  rawYear?: string,
  rawClass?: string,
  session?: mongoose.ClientSession
): Promise<string> {
  const year = normalizeAcademicYear(rawYear);
  const className = normalizeClassName(rawClass);
  const key = `student_id:${year}:${className}`;

  const seqNumber = await getNextSequence(key, session);
  const seq = String(seqNumber).padStart(3, '0');
  return `GGPS-${year}-${className}-${seq}`;
}

/**
 * Concurrency-safe atomic generation of Admission Number:
 * Format: GGPS-{ACADEMIC_YEAR}Admin-{SEQUENCE}
 * Example: GGPS-2026Admin-001
 */
export async function generateNextAdmissionNumber(
  rawYear?: string,
  rawClass?: string,
  session?: mongoose.ClientSession
): Promise<string> {
  const year = normalizeAcademicYear(rawYear);
  const key = `admission_no:${year}`;

  const seqNumber = await getNextSequence(key, session);
  const seq = String(seqNumber).padStart(3, '0');
  return `GGPS-${year}Admin-${seq}`;
}

/**
 * Concurrency-safe atomic generation of Employee ID:
 * Format: GGPS-{ACADEMIC_YEAR}-{ROLE}-{SEQUENCE}
 * Example: GGPS-2026-Teacher-001
 */
export async function generateNextEmployeeID(
  role: string = 'Teacher',
  rawYear?: string,
  session?: mongoose.ClientSession
): Promise<string> {
  const year = normalizeAcademicYear(rawYear);
  const normalizedRole = role.replace(/[^a-zA-Z0-9]/g, '');
  const key = `employee_id:${year}:${normalizedRole}`;

  const seqNumber = await getNextSequence(key, session);
  const seq = String(seqNumber).padStart(3, '0');
  return `GGPS-${year}-${normalizedRole}-${seq}`;
}

/**
 * Concurrency-safe atomic generation of Roll Number:
 * Unique within: Academic Year + Class + Section
 * Format: 001, 002, 003...
 */
export async function generateNextRollNumber(
  rawYear?: string,
  rawClass?: string,
  rawSection?: string,
  session?: mongoose.ClientSession
): Promise<string> {
  const year = normalizeAcademicYear(rawYear);
  const className = normalizeClassName(rawClass);
  const sectionName = normalizeSectionName(rawSection);
  const key = `roll:${year}:${className}:${sectionName}`;

  const seqNumber = await getNextSequence(key, session);
  return String(seqNumber).padStart(3, '0');
}

/**
 * Concurrency-safe atomic generation of Fee Invoice Number:
 * Format: INV-{YEAR}-{SEQUENCE}
 */
export async function generateNextInvoiceNumber(
  rawYear?: string,
  session?: mongoose.ClientSession
): Promise<string> {
  const year = normalizeAcademicYear(rawYear);
  const key = `invoice:${year}`;

  const seqNumber = await getNextSequence(key, session);
  const seq = String(seqNumber).padStart(4, '0');
  return `INV-${year}-${seq}`;
}

/**
 * Concurrency-safe atomic generation of Fee Receipt Number:
 * Format: REC-{YEAR}-{SEQUENCE}
 */
export async function generateNextReceiptNumber(
  rawYear?: string,
  session?: mongoose.ClientSession
): Promise<string> {
  const year = normalizeAcademicYear(rawYear);
  const key = `receipt:${year}`;

  const seqNumber = await getNextSequence(key, session);
  const seq = String(seqNumber).padStart(5, '0');
  return `REC-${year}-${seq}`;
}

/**
 * Peek non-binding live preview of the next identifiers WITHOUT incrementing the sequence.
 */
export async function peekNextIdentifiers(
  rawYear?: string,
  rawClass?: string,
  rawSection?: string
): Promise<{
  previewAdmissionNumber: string;
  previewStudentID: string;
  previewRollNumber: string;
  normalizedYear: string;
  normalizedClass: string;
  normalizedSection: string;
}> {
  const year = normalizeAcademicYear(rawYear);
  const className = normalizeClassName(rawClass);
  const sectionName = normalizeSectionName(rawSection);

  let admSeq = 1;
  let stuSeq = 1;
  let rollSeq = 1;

  if (mongoose.connection.readyState === 1) {
    const [admCounter, stuCounter, rollCounter] = await Promise.all([
      Counter.findOne({ key: `admission_no:${year}` }),
      Counter.findOne({ key: `student_id:${year}:${className}` }),
      Counter.findOne({ key: `roll:${year}:${className}:${sectionName}` }),
    ]);

    admSeq = (admCounter?.sequence || 0) + 1;
    stuSeq = (stuCounter?.sequence || 0) + 1;
    rollSeq = (rollCounter?.sequence || 0) + 1;
  } else {
    admSeq = (inMemoryCounters.get(`admission_no:${year}`) || 0) + 1;
    stuSeq = (inMemoryCounters.get(`student_id:${year}:${className}`) || 0) + 1;
    rollSeq = (inMemoryCounters.get(`roll:${year}:${className}:${sectionName}`) || 0) + 1;
  }

  return {
    previewAdmissionNumber: `GGPS-${year}Admin-${String(admSeq).padStart(3, '0')}`,
    previewStudentID: `GGPS-${year}-${className}-${String(stuSeq).padStart(3, '0')}`,
    previewRollNumber: String(rollSeq).padStart(3, '0'),
    normalizedYear: year,
    normalizedClass: className,
    normalizedSection: sectionName,
  };
}
