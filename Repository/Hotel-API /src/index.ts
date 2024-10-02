import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { roomsController } from "./controllers/roomController";
import { bookingsController } from "./controllers/bookingController";
import { contactsController } from "./controllers/contactsController";
import { usersController } from "./controllers/usercontroller";

dotenv.config();

const app = express();
const port = process.env.PORT || 3018;

const mongoUri =
  process.env.MONGO_URI ||
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

async function loadMySQLDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DATABASE,
    });
    console.log("Connected to MySQL");
    return connection;
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
  }
}

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept",
  })
);

app.use(express.json());

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.end();
  }
  next();
});

loadMySQLDatabase()
  .then((connection) => {
    app.use("/users", usersController(connection));
    app.use("/rooms", roomsController);
    app.use("/bookings", bookingsController);
    app.use("/contacts", contactsController);

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MySQL:", err);
  });
