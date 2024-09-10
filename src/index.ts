import express from "express";
import bookingsRoutes from "./routes/bookingsRoutes";
import roomsRoutes from "./routes/roomsRoutes";
import usersRoutes from "./routes/usersRoutes";
import contactsRoutes from "./routes/contactsRoutes";

const app = express();
const port = 3005;

app.use(express.json());

app.use("/api", bookingsRoutes);
app.use("/api", roomsRoutes);
app.use("/api", usersRoutes);
app.use("/api", contactsRoutes);

app.get("/", (req, res) => {
  res.json({
    hotelName: "Hotel Miranda",
    endpoints: [
      { method: "GET", path: "/api/bookings" },
      { method: "GET", path: "/api/rooms" },
      { method: "GET", path: "/api/users" },
      { method: "GET", path: "/api/contacts" },
    ],
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
