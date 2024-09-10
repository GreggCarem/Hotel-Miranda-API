import fs from "fs";
import path from "path";
import { Room } from "../interfaces/Room";

const roomsFilePath = path.join(__dirname, "../data/rooms.json");

const readRoomsFile = (): Room[] => {
  const data = fs.readFileSync(roomsFilePath, "utf-8");
  return JSON.parse(data);
};

const writeRoomsFile = (data: Room[]): void => {
  fs.writeFileSync(roomsFilePath, JSON.stringify(data, null, 2), "utf-8");
};

export const fetchAllRooms = (): Room[] => {
  return readRoomsFile();
};

export const fetchRoomById = (id: number): Room | undefined => {
  const rooms = readRoomsFile();
  return rooms.find((room) => room.id === id);
};

export const addRoom = (newRoom: Room): Room[] => {
  const rooms = readRoomsFile();
  rooms.push(newRoom);
  writeRoomsFile(rooms);
  return rooms;
};

export const updateRoomById = (
  id: number,
  updatedRoom: Partial<Room>
): Room | undefined => {
  const rooms = readRoomsFile();
  const index = rooms.findIndex((room) => room.id === id);

  if (index !== -1) {
    rooms[index] = { ...rooms[index], ...updatedRoom };
    writeRoomsFile(rooms);
    return rooms[index];
  }
  return undefined;
};

export const deleteRoomById = (id: number): Room[] => {
  let rooms = readRoomsFile();
  rooms = rooms.filter((room) => room.id !== id);
  writeRoomsFile(rooms);
  return rooms;
};
