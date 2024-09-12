import fs from "fs";
import path from "path";
import { Booking } from "../interfaces/Booking";

const dbPath = path.join(__dirname, "../data/db.json");

const readData = (): any => {
  const jsonData = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(jsonData);
};

const writeData = (data: any) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(dbPath, jsonData, "utf-8");
};

export class BookingService {
  getAll(): Booking[] {
    const data = readData();
    return data.bookings;
  }

  getById(id: string): Booking {
    const data = readData();
    const booking = data.bookings.find(
      (bookingData: Booking) => bookingData.id === id
    );
    if (!booking) {
      throw new Error(`Booking with id: ${id} not found`);
    }
    return booking;
  }

  create(newBooking: Booking): Booking {
    const data = readData();
    data.bookings.push(newBooking);
    writeData(data);
    return newBooking;
  }

  update(id: string, updatedBooking: Booking): Booking {
    const data = readData();
    const bookingIndex = data.bookings.findIndex(
      (booking: Booking) => booking.id === id
    );
    if (bookingIndex === -1) {
      throw new Error(`Booking with id: ${id} not found`);
    }
    data.bookings[bookingIndex] = updatedBooking;
    writeData(data);
    return updatedBooking;
  }

  delete(id: string): void {
    const data = readData();
    const bookingIndex = data.bookings.findIndex(
      (booking: Booking) => booking.id === id
    );
    if (bookingIndex === -1) {
      throw new Error(`Booking with id: ${id} not found`);
    }
    data.bookings.splice(bookingIndex, 1);
    writeData(data);
  }
}
