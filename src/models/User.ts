import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  fullName: string;
  email: string;
  password: string;
  photo: string;
  entryDate: Date;
  positionDescription: string;
  phone: string;
  status: string;
  position: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, required: false },
  entryDate: { type: Date, required: true },
  positionDescription: { type: String, required: false },
  phone: { type: String, required: true },
  status: { type: String, required: true },
  position: { type: String, required: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);
