import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { roomsController } from "./controllers/roomController";
import { bookingsController } from "./controllers/bookingController";
import { contactsController } from "./controllers/contactsController";
import { usersController } from "./controllers/usercontroller";

dotenv.config();

const app = express();
const port = process.env.PORT || 3018;

const mongoUri =
  "mongodb+srv://gregorten1:2cPbAxeXZ8zaMKf8@hoteldb.l3pj1.mongodb.net/?retryWrites=true&w=majority&appName=hotelDB";
mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept",
  })
);

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.end();
  }
  next();
});

app.use(express.json());

app.use("/users", usersController);
app.use("/rooms", roomsController);
app.use("/bookings", bookingsController);
app.use("/contacts", contactsController);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
