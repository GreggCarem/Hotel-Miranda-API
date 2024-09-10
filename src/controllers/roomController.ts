import { Request, Response } from "express";

import {
  updateRoomById as updateRoomByIdService,
  fetchAllRooms,
  fetchRoomById,
  addRoom,
  deleteRoomById,
} from "../services/roomServices";
import { Room } from "../interfaces/Room";

export const getAllRooms = (req: Request, res: Response): void => {
  const rooms = fetchAllRooms();
  res.json(rooms);
};

export const getRoomById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const room = fetchRoomById(parseInt(id));
  if (!room) {
    res.status(404).json({ message: "Room not found" });
  } else {
    res.json(room);
  }
};

export const createRoom = (req: Request, res: Response): void => {
  const newRoom: Room = { id: Date.now(), ...req.body };
  const rooms = addRoom(newRoom);
  res.status(201).json(rooms);
};

export const updateRoomById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedRoom: Partial<Room> = req.body;

  const room = updateRoomByIdService(parseInt(id), updatedRoom);

  if (!room) {
    res.status(404).json({ message: "Room not found" });
  } else {
    res.json(room);
  }
};

export const removeRoom = (req: Request, res: Response): void => {
  const { id } = req.params;
  const rooms = deleteRoomById(parseInt(id));
  res.json(rooms);
};
