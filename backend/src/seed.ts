import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load models
import Role from './models/Role';
import User from './models/User';
import Parent from './models/Parent';
import Student from './models/Student';
import Assessment from './models/Assessment';
import Payroll from './models/Payroll';

dotenv.config();

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from environment');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const options = { upsert: true, new: true, runValidators: true };

    // Find or create roles
    const adminRole = await Role.findOneAndUpdate({ name: 'SuperAdmin' }, { name: 'SuperAdmin', permissions: ['all'] }, options);
    const teacherRole = await Role.findOneAndUpdate({ name: 'Teacher' }, { name: 'Teacher', permissions: ['read', 'write'] }, options);
    const parentRole = await Role.findOneAndUpdate({ name: 'Parent' }, { name: 'Parent', permissions: ['read'] }, options);

    if (!adminRole || !teacherRole || !parentRole) {
      throw new Error('Failed to initialize roles');
    }

    // Hash a default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create a Staff/SuperAdmin
    const staff = await User.findOneAndUpdate(
      { email: 'admin@schoolerp.com' },
      {
        firstName: 'Alice',
        lastName: 'Admin',
        email: 'admin@schoolerp.com',
        passwordHash: hashedPassword,
        role: adminRole._id,
        isActive: true,
        phoneNumber: '1234567890'
      },
      options
    );
    console.log('Admin created: admin@schoolerp.com / password123');

    // 2. Create a Teacher
    const teacher = await User.findOneAndUpdate(
      { email: 'teacher@school.com' },
      {
        firstName: 'Tom',
        lastName: 'Teacher',
        email: 'teacher@school.com',
        passwordHash: hashedPassword,
        role: teacherRole._id,
        isActive: true,
        phoneNumber: '0987654321',
        designation: 'Lead Instructor',
        salary: 4000
      },
      options
    );
    console.log('Teacher created: teacher@school.com / password123');

    // 3. Create a Parent User
    const parentUser = await User.findOneAndUpdate(
      { email: 'parent@school.com' },
      {
        firstName: 'Patty',
        lastName: 'Parent',
        email: 'parent@school.com',
        passwordHash: hashedPassword,
        role: parentRole._id,
        isActive: true,
        phoneNumber: '5551234567'
      },
      options
    );

    if (!parentUser || !teacher || !staff) {
      throw new Error('Failed to create staff or parent users');
    }

    // Create the detailed Parent profile
    const parentProfile = await Parent.findOneAndUpdate(
      { userId: parentUser._id },
      {
        userId: parentUser._id,
        fatherName: 'Paul Parent',
        motherName: 'Patty Parent',
        primaryEmail: 'parent@school.com',
        fatherContact: '5551234567',
        whatsappNumber: '+15551234567',
        address: '123 Family Lane'
      },
      options
    );

    if (!parentProfile) {
      throw new Error('Failed to create parent profile');
    }
    console.log('Parent created: parent@school.com / password123');

    // 4. Create a Student
    const student = await Student.findOneAndUpdate(
      { admissionNumber: 'SEED-001' },
      {
        firstName: 'Sammy',
        lastName: 'Student',
        admissionNumber: 'SEED-001',
        grade: 'LKG',
        parentId: parentProfile._id,
        status: 'Active',
        bloodGroup: 'O+',
        medicalNotes: 'No allergies.'
      },
      options
    );

    if (!student) {
      throw new Error('Failed to create student');
    }
    console.log('Student created: Sammy Student');

    // 5. Create an Assessment for the Student
    await Assessment.deleteMany({ childId: student._id }); // Clear old ones to avoid duplicates on re-run
    await Assessment.create({
      childId: student._id,
      term: 'Term 1',
      rubrics: [
        { category: 'Motor Skills', skill: 'Holds pencil correctly', score: 'Mastered' },
        { category: 'Social Skills', skill: 'Shares toys with others', score: 'Developing' },
        { category: 'Cognitive', skill: 'Recognizes colors', score: 'Mastered' }
      ],
      teacherComments: 'Sammy is doing excellent work and is very friendly in class.',
      createdBy: teacher._id
    });
    console.log('Assessment created for Sammy.');

    // 6. Create a Payroll record for the Teacher
    await Payroll.deleteMany({ staffId: teacher._id, month: 'June 2026' });
    await Payroll.create({
      staffId: teacher._id,
      month: 'June 2026',
      baseSalary: 4000,
      attendanceDays: 30,
      deductions: 0,
      bonuses: 200,
      netSalary: 4200,
      status: 'Paid',
      paymentDate: new Date()
    });
    console.log('Payroll created for Tom Teacher.');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
