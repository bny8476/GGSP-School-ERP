import { Request, Response } from 'express';
import Student from '../models/Student';

// @desc    Get all students
// @route   GET /api/students
export const getStudents = async (req: Request, res: Response) => {
  try {
    let query: Record<string, unknown> = {};
    if (req.user?.role === 'Parent') {
      query.parentId = req.user.id;
    }
    const students = await Student.find(query)
      .populate('parentId', 'fatherName motherName primaryEmail')
      .populate('classId', 'name')
      .populate('sectionId', 'name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a student
// @route   POST /api/students
export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: 'Invalid student data', error });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

import Assessment from '../models/Assessment';
import { generateReportCardPDF } from '../utils/pdfGenerator';

// @desc    Download Student Report Card PDF
// @route   GET /api/students/:id/report-card
export const downloadReportCard = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch assessments for this child
    const assessments = await Assessment.find({ childId: student._id }).sort({ date: 1 });

    // The utility will pipe directly to `res`
    generateReportCardPDF(res, student, assessments);
  } catch (error) {
    console.error('Report Card PDF Error:', error);
    res.status(500).json({ message: 'Failed to generate Report Card' });
  }
};
