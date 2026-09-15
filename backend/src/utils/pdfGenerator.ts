import { Response } from 'express';
import PDFDocument from 'pdfkit';

export interface PayslipData {
  month: string;
  status: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  paymentDate?: Date | string;
  staffId?: {
    firstName?: string;
    lastName?: string;
  };
}

export interface RubricData {
  category: string;
  skill: string;
  score: string;
}

export interface AssessmentData {
  term: string;
  date: Date | string;
  rubrics: RubricData[];
  teacherComments: string;
}

export interface StudentPDFData {
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  className?: string;
  section?: string;
  dateOfBirth?: Date | string;
}

/**
 * Utility to generate a PDF for a Salary Payslip
 */
export const generatePayslipPDF = (res: Response, payrollData: PayslipData) => {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe its output to the Express response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=payslip_${payrollData.month.replace(/\s+/g, '_')}.pdf`);
  doc.pipe(res);

  // Header
  doc.fillColor('#4f46e5').fontSize(24).text('Global International', { align: 'center' });
  doc.fillColor('#64748b').fontSize(10).text('123 Education Lane, Learning City, 10001', { align: 'center' });
  doc.moveDown(2);

  // Title
  doc.fillColor('#0f172a').fontSize(18).text('Salary Payslip', { align: 'center' });
  doc.moveDown(1.5);

  // Staff Details
  doc.fontSize(12);
  doc.text(`Staff Name: ${payrollData.staffId?.firstName || ''} ${payrollData.staffId?.lastName || ''}`);
  doc.text(`Month: ${payrollData.month}`);
  doc.text(`Status: ${payrollData.status}`);
  if (payrollData.paymentDate) {
    doc.text(`Paid On: ${new Date(payrollData.paymentDate).toLocaleDateString()}`);
  }
  doc.moveDown(2);

  // Salary Table
  const tableTop = doc.y;
  const leftColumn = 50;
  const rightColumn = 400;

  // Draw separator line
  doc.moveTo(leftColumn, tableTop).lineTo(550, tableTop).stroke();
  doc.moveDown(0.5);

  doc.text('Base Salary:', leftColumn, doc.y);
  doc.text(`Rs. ${payrollData.baseSalary}`, rightColumn, doc.y, { align: 'right' });
  doc.moveDown(0.5);

  doc.text('Bonuses/Allowances:', leftColumn, doc.y);
  doc.text(`+ Rs. ${payrollData.bonuses}`, rightColumn, doc.y, { align: 'right' });
  doc.moveDown(0.5);

  doc.text('Deductions:', leftColumn, doc.y);
  doc.text(`- Rs. ${payrollData.deductions}`, rightColumn, doc.y, { align: 'right' });
  doc.moveDown(0.5);

  // Draw separator line
  doc.moveTo(leftColumn, doc.y + 5).lineTo(550, doc.y + 5).stroke();
  doc.moveDown(1);

  doc.font('Helvetica-Bold').text('Net Salary:', leftColumn, doc.y);
  doc.font('Helvetica-Bold').text(`Rs. ${payrollData.netSalary}`, rightColumn, doc.y, { align: 'right' });

  // Footer
  doc.moveDown(5);
  doc.font('Helvetica').fontSize(10).fillColor('#94a3b8').text('This is a computer-generated document and does not require a signature.', 50, doc.y, { align: 'center' });

  doc.end();
};

/**
 * Utility to generate a PDF for a Student Report Card
 */
export const generateReportCardPDF = (res: Response, student: StudentPDFData, assessments: AssessmentData[]) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=report_card_${student.firstName}_${student.lastName}.pdf`);
  doc.pipe(res);

  // Header
  doc.fillColor('#4f46e5').fontSize(24).text('Global International', { align: 'center' });
  doc.fillColor('#64748b').fontSize(10).text('Early Childhood Education Report', { align: 'center' });
  doc.moveDown(2);

  // Title
  doc.fillColor('#0f172a').fontSize(18).text('Student Report Card', { align: 'center' });
  doc.moveDown(1.5);

  // Student Details
  doc.fontSize(12).fillColor('#334155');
  doc.text(`Student Name: ${student.firstName} ${student.lastName}`);
  doc.text(`Admission No: ${student.admissionNumber || 'N/A'}`);
  doc.text(`Class: ${student.className || 'N/A'} - Section ${student.section || 'N/A'}`);
  doc.text(`Date of Birth: ${student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}`);
  doc.moveDown(2);

  // Loop through assessments
  if (assessments.length === 0) {
    doc.text('No assessments available for this student yet.');
  } else {
    assessments.forEach((assessment) => {
      doc.font('Helvetica-Bold').fontSize(14).fillColor('#0f172a').text(assessment.term);
      doc.font('Helvetica').fontSize(10).fillColor('#64748b').text(`Assessed on: ${new Date(assessment.date).toLocaleDateString()}`);
      doc.moveDown(0.5);

      // Rubrics Table
      const startY = doc.y;
      assessment.rubrics.forEach((rubric: RubricData) => {
        doc.font('Helvetica-Bold').fillColor('#334155').text(rubric.category, 50, doc.y);
        doc.font('Helvetica').text(rubric.skill, 150, doc.y);
        doc.font('Helvetica-Oblique').fillColor('#4f46e5').text(rubric.score, 400, doc.y, { align: 'right' });
        doc.moveDown(0.3);
      });
      doc.moveDown(1);

      // Comments
      doc.font('Helvetica-Bold').fillColor('#334155').text('Teacher Comments:');
      doc.font('Helvetica').text(assessment.teacherComments, { indent: 20 });
      doc.moveDown(2);
    });
  }

  // Footer
  doc.moveDown(3);
  doc.font('Helvetica').fontSize(10).fillColor('#94a3b8').text('This is a computer-generated document and does not require a signature.', 50, doc.y, { align: 'center' });

  doc.end();
};
