import { Booking, IBooking } from "../models/Booking";

export class BookingService {
  async getAll(): Promise<IBooking[]> {
    return await Booking.find().populate("userId").populate("roomId").exec();
  }

  async getById(id: string): Promise<IBooking | null> {
    return await Booking.findById(id)
      .populate("userId")
      .populate("roomId")
      .exec();
  }

  async create(newBooking: IBooking): Promise<IBooking> {
    const booking = new Booking(newBooking);
    return await booking.save();
  }

  async update(
    id: string,
    updatedBooking: Partial<IBooking>
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(id, updatedBooking, {
      new: true,
    }).exec();
  }

  async delete(id: string): Promise<void> {
    await Booking.findByIdAndDelete(id).exec();
  }
}
