import mongoose, { Schema, Document } from 'mongoose';

export interface ISportsTeam extends Document {
  name: string;
  sport: string;
  coach?: mongoose.Types.ObjectId;
  captain?: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  academicYear?: string;
  achievements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SportsTeamSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    sport: { type: String, required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'User' },
    captain: { type: Schema.Types.ObjectId, ref: 'Student' },
    members: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    academicYear: { type: String },
    achievements: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.SportsTeam || mongoose.model<ISportsTeam>('SportsTeam', SportsTeamSchema);
