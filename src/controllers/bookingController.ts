import { Request, Response } from "express";
import {
  fetchAllBookings,
  fetchBookingById,
  addBooking,
  deleteBooking,
} from "../services/bookingServices";
import { Booking } from "../interfaces/Booking";

export const getAllBookings = (req: Request, res: Response): void => {
  const bookings = fetchAllBookings();
  res.json(bookings);
};

export const getBookingById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const booking = fetchBookingById(id);
  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
  } else {
    res.json(booking);
  }
};

export const createBooking = (req: Request, res: Response): void => {
  const newBooking: Booking = req.body;
  const bookings = addBooking(newBooking);
  res.status(201).json(bookings);
};

export const removeBooking = (req: Request, res: Response): void => {
  const { id } = req.params;
  const bookings = deleteBooking(id);
  res.json(bookings);
};
