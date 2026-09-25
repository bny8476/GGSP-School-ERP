import mongoose, { Schema, Document } from 'mongoose';

export interface ITeachingAssignment {
  classId: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
}

export interface ITeacherProfile extends Document {
  employeeId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  teachingAssignments: ITeachingAssignment[];
  specializations: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TeachingAssignmentSchema: Schema = new Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
  },
  { _id: false }
);

const TeacherProfileSchema: Schema = new Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    teachingAssignments: [TeachingAssignmentSchema],
    specializations: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.TeacherProfile || mongoose.model<ITeacherProfile>('TeacherProfile', TeacherProfileSchema);
