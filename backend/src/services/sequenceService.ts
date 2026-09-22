import mongoose from 'mongoose';
import Counter from '../models/Counter';

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
 * (e.g. "Class 1" -> "CLASS1", "LKG - Section A" -> "LKG", "UKG" -> "UKG").
 */
export function normalizeClassName(rawClass?: string): string {
  if (!rawClass) return 'LKG';
  // Remove "Class" prefix with space, or keep alphanumeric
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
 * Concurrency-safe atomic generation of Admission Number:
 * Format: GGPS-{ACADEMIC_YEAR}-{CLASS}-{SEQUENCE}
 * Example: GGPS-2026-LKG-001
 */
export async function generateNextAdmissionNumber(
  rawYear?: string,
  rawClass?: string,
  session?: mongoose.ClientSession
): Promise<string> {
  const year = normalizeAcademicYear(rawYear);
  const className = normalizeClassName(rawClass);
  const key = `admission:${year}:${className}`;

  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { sequence: 1 } },
    { upsert: true, new: true, session }
  );

  const seq = String(counter.sequence).padStart(3, '0');
  return `GGPS-${year}-${className}-${seq}`;
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

  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { sequence: 1 } },
    { upsert: true, new: true, session }
  );

  return String(counter.sequence).padStart(3, '0');
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
  previewRollNumber: string;
  normalizedYear: string;
  normalizedClass: string;
  normalizedSection: string;
}> {
  const year = normalizeAcademicYear(rawYear);
  const className = normalizeClassName(rawClass);
  const sectionName = normalizeSectionName(rawSection);

  const admissionKey = `admission:${year}:${className}`;
  const rollKey = `roll:${year}:${className}:${sectionName}`;

  const [admissionCounter, rollCounter] = await Promise.all([
    Counter.findOne({ key: admissionKey }),
    Counter.findOne({ key: rollKey }),
  ]);

  const nextAdmissionSeq = String((admissionCounter?.sequence || 0) + 1).padStart(3, '0');
  const nextRollSeq = String((rollCounter?.sequence || 0) + 1).padStart(3, '0');

  return {
    previewAdmissionNumber: `GGPS-${year}-${className}-${nextAdmissionSeq}`,
    previewRollNumber: nextRollSeq,
    normalizedYear: year,
    normalizedClass: className,
    normalizedSection: sectionName,
  };
}
