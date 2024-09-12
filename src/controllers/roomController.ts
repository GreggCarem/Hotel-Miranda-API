import { Request, Response, Router } from "express";
import { RoomService } from "../services/roomServices";
import { Room } from "../interfaces/Room";
import { authenticateTokenMiddleware } from "../middleware/authMiddleware";

export const roomsController = Router();

roomsController.use(authenticateTokenMiddleware);

roomsController.get("", async (req: Request, res: Response) => {
  const roomService = new RoomService();
  return res.status(200).send({ data: roomService.getAll() });
});

roomsController.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const roomService = new RoomService();
    try {
      return res.status(200).send({ data: roomService.getById(req.params.id) });
    } catch (error) {
      return res.status(404).send({ message: "Error getting Room ID" });
    }
  }
);

roomsController.post("", async (req: Request, res: Response) => {
  const roomService = new RoomService();
  const newRoom: Room = req.body;

  try {
    const createdRoom = roomService.create(newRoom);
    return res.status(201).send({ data: createdRoom });
  } catch (error) {
    return res.status(500).send({ message: "Error creating Room" });
  }
});

roomsController.put(
  "/:id",
  async (req: Request<{ id: string }, {}, Room>, res: Response) => {
    const roomService = new RoomService();
    const roomId = req.params.id;
    const updatedRoomData: Room = req.body;

    try {
      const updatedRoom = roomService.update(roomId, updatedRoomData);
      return res.status(200).send({ data: updatedRoom });
    } catch (error) {
      return res.status(404).send({ message: "Error updating Room" });
    }
  }
);

roomsController.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const roomService = new RoomService();
    const roomId = req.params.id;

    try {
      roomService.delete(roomId);
      return res.status(200).send({ message: "Room deleted successfully" });
    } catch (error) {
      return res.status(404).send({ message: "Error deleting Room" });
    }
  }
);
