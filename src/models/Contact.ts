import mongoose, { Schema, Document } from "mongoose";

export interface ContactInterface extends Document {
  date: string;
  name: string;
  message: string;
  archiveStatus: boolean;
}

const ContactSchema: Schema = new Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  archiveStatus: { type: Boolean, default: false },
});

export const Contact = mongoose.model<ContactInterface>(
  "Contact",
  ContactSchema
);
