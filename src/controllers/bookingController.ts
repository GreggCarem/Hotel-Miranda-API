import express, { Request, Response } from "express";
import { BookingService } from "../services/bookingServices";

export const bookingsController = express.Router();
const bookingService = new BookingService();

bookingsController.get("/", async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAll();
    res.status(200).json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving bookings" });
  }
});

bookingsController.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const booking = await bookingService.getById(req.params.id);
      if (booking) {
        res.status(200).json({ data: booking });
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error retrieving booking" });
    }
  }
);

bookingsController.post("/", async (req: Request, res: Response) => {
  try {
    const newBooking = req.body;
    const createdBooking = await bookingService.create(newBooking);
    res.status(201).json({ data: createdBooking });
  } catch (err) {
    res.status(500).json({ message: "Error creating booking" });
  }
});

bookingsController.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const updatedBooking = await bookingService.update(
        req.params.id,
        req.body
      );
      if (updatedBooking) {
        res.status(200).json({ data: updatedBooking });
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error updating booking" });
    }
  }
);

bookingsController.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      await bookingService.delete(req.params.id);
      res.status(200).json({ message: "Booking deleted successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting booking" });
    }
  }
);
