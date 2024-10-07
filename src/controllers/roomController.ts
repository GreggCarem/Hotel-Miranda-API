import express, { Request, Response } from "express";
import { RoomService } from "../services/roomServices";

export const roomsController = express.Router();
const roomService = new RoomService();

roomsController.get("/", async (req: Request, res: Response) => {
  try {
    const rooms = await roomService.getAll();
    res.status(200).json({ data: rooms });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving rooms" });
  }
});

roomsController.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const room = await roomService.getById(req.params.id);
      if (room) {
        res.status(200).json({ data: room });
      } else {
        res.status(404).json({ message: "Room not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error retrieving room" });
    }
  }
);

roomsController.post("/", async (req: Request, res: Response) => {
  try {
    const newRoom = req.body;
    const createdRoom = await roomService.create(newRoom);
    res.status(201).json({ data: createdRoom });
  } catch (err) {
    res.status(500).json({ message: "Error creating room" });
  }
});

roomsController.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const updatedRoom = await roomService.update(req.params.id, req.body);
      if (updatedRoom) {
        res.status(200).json({ data: updatedRoom });
      } else {
        res.status(404).json({ message: "Room not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error updating room" });
    }
  }
);

roomsController.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      await roomService.delete(req.params.id);
      res.status(200).json({ message: "Room deleted successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting room" });
    }
  }
);
