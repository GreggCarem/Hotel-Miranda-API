import { Request, Response, Router } from "express";
import { BookingService } from "../services/bookingServices";
import { Booking } from "../interfaces/Booking";
import { authenticateTokenMiddleware } from "../middleware/authMiddleware";

export const bookingsController = Router();

bookingsController.use(authenticateTokenMiddleware);

bookingsController.get("", async (req: Request, res: Response) => {
  const bookingService = new BookingService();
  return res.status(200).send({ data: bookingService.getAll() });
});

bookingsController.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const bookingService = new BookingService();
    try {
      return res
        .status(200)
        .send({ data: bookingService.getById(req.params.id) });
    } catch (error) {
      return res.status(404).send({ message: "Error getting Booking ID" });
    }
  }
);

bookingsController.post("", async (req: Request, res: Response) => {
  const bookingService = new BookingService();
  const newBooking: Booking = req.body;

  try {
    const createdBooking = bookingService.create(newBooking);
    return res.status(201).send({ data: createdBooking });
  } catch (error) {
    return res.status(500).send({ error: "Error creating the booking" });
  }
});

bookingsController.put(
  "/:id",
  async (req: Request<{ id: string }, {}, Booking>, res: Response) => {
    const bookingService = new BookingService();
    const bookingId = req.params.id;
    const updatedBookingData: Booking = req.body;

    try {
      const updatedBooking = bookingService.update(
        bookingId,
        updatedBookingData
      );
      return res.status(200).send({ data: updatedBooking });
    } catch (error) {
      return res.status(404).send({ message: "Error updating Booking" });
    }
  }
);

bookingsController.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const bookingService = new BookingService();
    const bookingId = req.params.id;

    try {
      bookingService.delete(bookingId);
      return res.status(200).send({ message: "Booking deleted successfully" });
    } catch (error) {
      return res.status(404).send({ message: "Error deleting Booking" });
    }
  }
);
