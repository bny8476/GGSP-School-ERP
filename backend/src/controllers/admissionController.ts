import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admission from '../models/Admission';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';
import AcademicYear from '../models/AcademicYear';
import Class from '../models/Class';
import Section from '../models/Section';
import Parent from '../models/Parent';
import StudentParent from '../models/StudentParent';
import User from '../models/User';
import Role from '../models/Role';
import Notification from '../models/Notification';
import {
  generateNextAdmissionNumber,
  generateNextStudentID,
  generateNextRollNumber,
} from '../services/sequenceService';
import { emitToRole, emitToUser, broadcastEvent } from '../socket';

// @desc    Get all admissions (with search, filter, pagination)
// @route   GET /api/admissions
export const getAdmissions = async (req: Request, res: Response) => {
  try {
    const { stage, status, search, page, limit } = req.query;
    const filter: Record<string, any> = {};

    if (stage) filter.stage = stage;
    if (status) filter.status = status;

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      filter.$or = [
        { childFirstName: searchRegex },
        { childLastName: searchRegex },
        { parentName: searchRegex },
        { applicationNumber: searchRegex },
        { email: searchRegex },
        { contactNumber: searchRegex },
      ];
    }

    if (page) {
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Math.min(100, Number(limit) || 20));
      const skip = (pageNum - 1) * limitNum;

      const [admissions, total] = await Promise.all([
        Admission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
        Admission.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        data: admissions,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
    }

    const admissions = await Admission.find(filter).sort({ createdAt: -1 });
    res.status(200).json(admissions);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching admissions', error });
  }
};

// @desc    Create an enquiry/admission (Supports both flat and nested { student, parent } payloads)
// @route   POST /api/admissions
export const createAdmission = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};

    // Normalize nested payload from public enquiry form if provided
    let childFirstName = body.childFirstName;
    let childLastName = body.childLastName;
    let dateOfBirth = body.dateOfBirth;
    let gender = body.gender;
    let gradeAppliedFor = body.gradeAppliedFor;
    let parentName = body.parentName;
    let email = body.email || body.parentEmail;
    let contactNumber = body.contactNumber || body.parentPhone;
    let address = body.address;

    if (body.student) {
      childFirstName = childFirstName || body.student.firstName;
      childLastName = childLastName || body.student.lastName;
      dateOfBirth = dateOfBirth || body.student.dateOfBirth;
      gender = gender || body.student.gender;
      gradeAppliedFor = gradeAppliedFor || body.student.gradeAppliedFor;
    }

    if (body.parent) {
      parentName = parentName || body.parent.name;
      email = email || body.parent.email;
      contactNumber = contactNumber || body.parent.contactNumber || body.parent.phone;
      address = address || body.parent.address;
    }

    if (!childFirstName || !childLastName || !parentName || !contactNumber || !email || !gradeAppliedFor) {
      return res.status(400).json({
        success: false,
        message: 'Missing required admission fields (childFirstName, childLastName, parentName, contactNumber, email, gradeAppliedFor)',
      });
    }

    const yearStr = new Date().getFullYear().toString();
    const applicationNumber = body.applicationNumber || (await generateNextAdmissionNumber(yearStr, gradeAppliedFor));

    const admission = await Admission.create({
      applicationNumber,
      childFirstName,
      childLastName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender: gender || 'Other',
      parentName,
      contactNumber,
      parentPhone: contactNumber,
      email: email.trim().toLowerCase(),
      parentEmail: email.trim().toLowerCase(),
      address: address || '',
      gradeAppliedFor,
      status: body.status || 'New Inquiry',
      stage: body.stage || 'Application',
      notes: body.notes || '',
      documents: body.documents || [],
    });

    // Notify administrators
    emitToRole('Admin', 'admission:new', admission);
    broadcastEvent('notification:new', {
      type: 'admission',
      message: `New admission enquiry received for ${childFirstName} ${childLastName} (${gradeAppliedFor})`,
    });

    res.status(201).json({
      success: true,
      message: 'Admission enquiry submitted successfully',
      admission,
      applicationNumber: admission.applicationNumber,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid admission data', error });
  }
};

// @desc    Approve admission and convert to Student + Enrollment + Parent account
// @route   POST /api/admissions/:id/approve
export const approveAdmission = async (req: Request, res: Response) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission record not found' });
    }

    // 1. Resolve Academic Year
    let activeYear = await AcademicYear.findOne({ isCurrent: true });
    if (!activeYear) {
      activeYear = await AcademicYear.findOne().sort({ createdAt: -1 });
    }
    if (!activeYear) {
      activeYear = await AcademicYear.create({
        name: '2026-2027',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2027-03-31'),
        status: 'active',
        isCurrent: true,
      });
    }

    // 2. Resolve Class
    const className = admission.gradeAppliedFor || 'LKG';
    let classDoc = await Class.findOne({ name: new RegExp(`^${className}$`, 'i') });
    if (!classDoc) {
      classDoc = await Class.create({ name: className });
    }

    // 3. Resolve Section
    const sectionName = req.body.sectionName || 'A';
    let sectionDoc = await Section.findOne({ classId: classDoc._id, name: new RegExp(`^${sectionName}$`, 'i') });
    if (!sectionDoc) {
      sectionDoc = await Section.create({ name: sectionName, classId: classDoc._id, capacity: 30 });
    }

    const yearStr = activeYear.name || '2026-27';

    // 4. Find or Create Parent User & Parent Profile
    let parentUser = await User.findOne({ email: admission.email });
    if (!parentUser) {
      let parentRole = await Role.findOne({ name: 'Parent' });
      if (!parentRole) {
        parentRole = await Role.create({ name: 'Parent', permissions: ['child:read', 'attendance:read', 'diary:read', 'fees:read'] });
      }

      const defaultPass = 'Welcome@123';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPass, salt);

      const nameParts = admission.parentName.split(' ');
      const pFirst = nameParts[0] || 'Parent';
      const pLast = nameParts.slice(1).join(' ') || 'Guardian';

      parentUser = await User.create({
        firstName: pFirst,
        lastName: pLast,
        email: admission.email,
        passwordHash,
        role: parentRole._id,
        phoneNumber: admission.contactNumber,
        isActive: true,
        status: 'Active',
      });
    }

    let parentDoc = await Parent.findOne({ $or: [{ userId: parentUser._id }, { primaryEmail: admission.email }] });
    if (!parentDoc) {
      parentDoc = await Parent.create({
        userId: parentUser._id,
        fatherName: admission.parentName,
        motherName: 'Mother',
        primaryEmail: admission.email,
        address: admission.address || 'Address',
        fatherContact: admission.contactNumber,
        whatsappNumber: admission.contactNumber,
      });
    }

    // 5. Generate Authoritative Unique Identifiers
    const studentId = await generateNextStudentID(yearStr, className);
    const admissionNumber = admission.applicationNumber || (await generateNextAdmissionNumber(yearStr, className));
    const rollNumber = await generateNextRollNumber(yearStr, className, sectionName);

    // 6. Create Student Record
    const student = await Student.create({
      studentId,
      admissionNumber,
      firstName: admission.childFirstName,
      lastName: admission.childLastName,
      gender: admission.gender || 'Other',
      dateOfBirth: admission.dateOfBirth,
      grade: className,
      classId: classDoc._id,
      sectionId: sectionDoc._id,
      parentId: parentDoc._id,
      emergencyContact: admission.contactNumber,
      enrollmentDate: new Date(),
      status: 'Active',
    });

    // 7. Create Enrollment Record
    const enrollment = await Enrollment.create({
      studentId: student._id,
      academicYearId: activeYear._id,
      classId: classDoc._id,
      sectionId: sectionDoc._id,
      rollNumber,
      admissionDate: new Date(),
      status: 'Active',
    });

    // 8. Link StudentParent Junction
    await StudentParent.findOneAndUpdate(
      { studentId: student._id, parentId: parentDoc._id },
      {
        studentId: student._id,
        parentId: parentDoc._id,
        relationship: 'Guardian',
        isPrimary: true,
      },
      { upsert: true }
    );

    // 9. Update Admission Stage
    admission.status = 'Admission Confirmed';
    admission.stage = 'Enrolled';
    admission.studentId = student._id;
    await admission.save();

    // 10. Send Welcome Notification to Parent
    await Notification.create({
      recipient: parentUser._id,
      userId: parentUser._id,
      studentId: student._id,
      targetRole: 'Parent',
      title: 'Admission Approved!',
      message: `Congratulations! ${student.firstName} ${student.lastName} has been officially enrolled into ${className} (Section ${sectionName}). Admission No: ${admissionNumber}`,
      type: 'admission',
      priority: 'high',
      link: '/parent',
      metadata: {
        studentId: student._id,
        admissionNumber,
        rollNumber,
        className,
        sectionName,
      },
    });

    emitToUser(parentUser._id.toString(), 'notification:new', {
      type: 'admission',
      message: `Admission Confirmed: ${student.firstName} has been enrolled!`,
    });
    emitToRole('Admin', 'student:created', { student, enrollment });

    res.status(200).json({
      success: true,
      message: `Admission approved successfully! Student created with Admission No: ${admissionNumber}`,
      student,
      enrollment,
      admissionNumber,
      rollNumber,
      parent: parentDoc,
      parentUser: {
        _id: parentUser._id,
        email: parentUser.email,
      },
    });
  } catch (error) {
    console.error('Approve admission error:', error);
    res.status(500).json({ success: false, message: 'Failed to approve admission', error });
  }
};

// @desc    Update admission stage/details
// @route   PUT /api/admissions/:id
export const updateAdmission = async (req: Request, res: Response) => {
  try {
    const {
      childFirstName,
      childLastName,
      dateOfBirth,
      gender,
      parentName,
      contactNumber,
      parentPhone,
      email,
      parentEmail,
      address,
      gradeAppliedFor,
      status,
      stage,
      interviewDate,
      interviewNotes,
      admissionScore,
      waitlistPosition,
      notes,
      documents,
    } = req.body;

    const allowedUpdates: Record<string, any> = {};
    if (childFirstName !== undefined) allowedUpdates.childFirstName = childFirstName;
    if (childLastName !== undefined) allowedUpdates.childLastName = childLastName;
    if (dateOfBirth !== undefined) allowedUpdates.dateOfBirth = dateOfBirth;
    if (gender !== undefined) allowedUpdates.gender = gender;
    if (parentName !== undefined) allowedUpdates.parentName = parentName;
    if (contactNumber !== undefined) allowedUpdates.contactNumber = contactNumber;
    if (parentPhone !== undefined) allowedUpdates.parentPhone = parentPhone;
    if (email !== undefined) allowedUpdates.email = email;
    if (parentEmail !== undefined) allowedUpdates.parentEmail = parentEmail;
    if (address !== undefined) allowedUpdates.address = address;
    if (gradeAppliedFor !== undefined) allowedUpdates.gradeAppliedFor = gradeAppliedFor;
    if (status !== undefined) allowedUpdates.status = status;
    if (stage !== undefined) allowedUpdates.stage = stage;
    if (interviewDate !== undefined) allowedUpdates.interviewDate = interviewDate;
    if (interviewNotes !== undefined) allowedUpdates.interviewNotes = interviewNotes;
    if (admissionScore !== undefined) allowedUpdates.admissionScore = admissionScore;
    if (waitlistPosition !== undefined) allowedUpdates.waitlistPosition = waitlistPosition;
    if (notes !== undefined) allowedUpdates.notes = notes;
    if (documents !== undefined) allowedUpdates.documents = documents;

    const admission = await Admission.findByIdAndUpdate(req.params.id, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission record not found' });
    }

    // Auto-approve if stage changed to 'Approved' or 'Enrolled' and studentId not yet created
    if ((allowedUpdates.stage === 'Approved' || allowedUpdates.status === 'Admission Confirmed') && !admission.studentId) {
      return approveAdmission(req, res);
    }

    res.status(200).json(admission);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid update data', error });
  }
};
