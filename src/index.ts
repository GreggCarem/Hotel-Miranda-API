import express from "express";
import { roomsController } from "./controllers/roomController";
import { bookingsController } from "./controllers/bookingController";
import { contactsController } from "./controllers/contactsController";
import { usersController } from "./controllers/usercontroller";

const app = express();
const port = process.env.PORT || 3005;

app.use(express.json());

app.use("/users", usersController);
app.use("/rooms", roomsController);
app.use("/bookings", bookingsController);
app.use("/contacts", contactsController);

app.listen(port, () => {
  console.log(` http://localhost:${port}`);
});
