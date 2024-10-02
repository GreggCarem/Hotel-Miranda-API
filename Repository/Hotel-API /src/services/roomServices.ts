import { Room, RoomInterface } from "../models/Rooms";

export class RoomService {
  async getAll(): Promise<RoomInterface[]> {
    return await Room.find().exec();
  }

  async getById(id: string): Promise<RoomInterface | null> {
    return await Room.findById(id).exec();
  }

  async create(newRoom: RoomInterface): Promise<RoomInterface> {
    const room = new Room(newRoom);
    return await room.save();
  }

  async update(
    id: string,
    updatedRoom: Partial<RoomInterface>
  ): Promise<RoomInterface | null> {
    return await Room.findByIdAndUpdate(id, updatedRoom, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await Room.findByIdAndDelete(id).exec();
  }
}
