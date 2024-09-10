import { Router } from "express";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  removeBooking,
} from "../controllers/bookingController";

const router = Router();

router.get("/bookings", getAllBookings);
router.get("/bookings/:id", getBookingById);
router.post("/bookings", createBooking);
router.delete("/bookings/:id", removeBooking);

export default router;
