import { Booking } from "../interfaces/Booking";
import fs from "fs";
import path from "path";

const bookingsFilePath = path.join(__dirname, "../data/bookings.json");

const readBookingsFile = (): Booking[] => {
  const data = fs.readFileSync(bookingsFilePath, "utf-8");
  return JSON.parse(data);
};

const writeBookingsFile = (data: Booking[]): void => {
  fs.writeFileSync(bookingsFilePath, JSON.stringify(data, null, 2), "utf-8");
};

export const fetchAllBookings = (): Booking[] => {
  return readBookingsFile();
};

export const fetchBookingById = (
  reservationID: string
): Booking | undefined => {
  const bookings = readBookingsFile();
  return bookings.find((booking) => booking.reservationID === reservationID);
};

export const addBooking = (newBooking: Booking): Booking[] => {
  const bookings = readBookingsFile();
  bookings.push(newBooking);
  writeBookingsFile(bookings);
  return bookings;
};

export const deleteBooking = (reservationID: string): Booking[] => {
  let bookings = readBookingsFile();
  bookings = bookings.filter(
    (booking) => booking.reservationID !== reservationID
  );
  writeBookingsFile(bookings);
  return bookings;
};
