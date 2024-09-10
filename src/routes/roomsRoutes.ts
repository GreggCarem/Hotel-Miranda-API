import { Router } from "express";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoomById,
  removeRoom,
} from "../controllers/roomController";

const router = Router();

router.get("/rooms", getAllRooms);
router.get("/rooms/:id", getRoomById);
router.post("/rooms", createRoom);
router.put("/rooms/:id", updateRoomById);
router.delete("/rooms/:id", removeRoom);

export default router;
