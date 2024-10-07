import Joi from "joi";
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

const RoomSchema = Joi.object({
  roomNumber: Joi.string().required(),
  bedType: Joi.string().valid("Single", "Double", "Queen", "King").required(),
  facilities: Joi.array().items(Joi.string()).required(),
  rate: Joi.number().positive().required(),
  offerPrice: Joi.number().positive(),
  status: Joi.string().valid("available", "booked", "maintenance").required(),
  description: Joi.string().required(),
  photo: Joi.string().uri().required(),
});

export const Room = mongoose.model<RoomInterface>("Room", RoomSchema);
