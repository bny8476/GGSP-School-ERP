import mongoose, { Schema, Document } from 'mongoose';

export interface ITransportStop {
  stopName: string;
  pickupTime: string; // e.g. "07:30"
  dropTime: string;   // e.g. "14:30"
  transportFee: number;
}

export interface ITransportRoute extends Document {
  routeName: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  stops: ITransportStop[];
  createdAt: Date;
  updatedAt: Date;
}

const StopSchema: Schema = new Schema({
  stopName: { type: String, required: true },
  pickupTime: { type: String, required: true },
  dropTime: { type: String, required: true },
  transportFee: { type: Number, required: true, default: 0 },
});

const TransportRouteSchema: Schema = new Schema(
  {
    routeName: { type: String, required: true, unique: true },
    vehicleNumber: { type: String, required: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    stops: [StopSchema],
  },
  { timestamps: true }
);

export default mongoose.models.TransportRoute || mongoose.model<ITransportRoute>('TransportRoute', TransportRouteSchema);
