import fs from "fs";
import path from "path";
import { Room } from "../interfaces/Room";

const dbPath = path.join(__dirname, "../data/db.json");

const readData = (): any => {
  const jsonData = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(jsonData);
};

const writeData = (data: any) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(dbPath, jsonData, "utf-8");
};

export class RoomService {
  getAll(): Room[] {
    const data = readData();
    return data.rooms;
  }

  getById(id: string): Room | null {
    const data = readData();
    const room = data.rooms.find((roomData: Room) => roomData.id === id);
    if (!room) {
      throw new Error(`Room with id: ${id} not found`);
    }
    return room;
  }

  create(newRoom: Room): Room {
    const data = readData();
    data.rooms.push(newRoom);
    writeData(data);
    return newRoom;
  }

  update(id: string, updatedRoom: Room): Room | null {
    const data = readData();
    const roomIndex = data.rooms.findIndex((room: Room) => room.id === id);
    if (roomIndex === -1) {
      throw new Error(`Room with id: ${id} not found`);
    }
    data.rooms[roomIndex] = updatedRoom;
    writeData(data);
    return updatedRoom;
  }

  delete(id: string): void {
    const data = readData();
    const roomIndex = data.rooms.findIndex((room: Room) => room.id === id);
    if (roomIndex === -1) {
      throw new Error(`Room with id: ${id} not found`);
    }
    data.rooms.splice(roomIndex, 1);
    writeData(data);
  }
}
