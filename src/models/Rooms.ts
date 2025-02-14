import mongoose, { Schema, Document } from "mongoose";

export interface RoomInterface extends Document {
  roomNumber: string;
  bedType: string;
  facilities: string[];
  rate: string;
  offerPrice: string;
  status: string;
  description: string;
  photo: string;
}

const RoomSchema: Schema = new Schema({
  roomNumber: { type: String, required: true, unique: true },
  bedType: { type: String, required: true },
  facilities: { type: [String], required: true },
  rate: { type: String, required: true },
  offerPrice: { type: String, required: true },
  status: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String, required: true },
});

export const Room = mongoose.model<RoomInterface>("Room", RoomSchema);
