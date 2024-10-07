import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: string;
}

const BookingSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true },
});

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
