import { Connection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { RoomInterface } from "../models/Rooms";

export class RoomService {
  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async getAll(): Promise<RoomInterface[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      "SELECT * FROM rooms"
    );
    return rows.map((row) => ({
      id: row.id.toString(),
      roomNumber: row.roomNumber,
      bedType: row.bedType,
      facilities: row.facilities.split(", "),
      rate: row.rate.toString(),
      offerPrice: row.offerPrice.toString(),
      status: row.status,
      description: row.description,
      photo: row.photo,
    })) as RoomInterface[];
  }

  async getById(id: string): Promise<RoomInterface | null> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      "SELECT * FROM rooms WHERE id = ?",
      [id]
    );
    if (rows.length > 0) {
      const row = rows[0];
      return {
        id: row.id.toString(),
        roomNumber: row.roomNumber,
        bedType: row.bedType,
        facilities: row.facilities.split(", "),
        rate: row.rate.toString(),
        offerPrice: row.offerPrice.toString(),
        status: row.status,
        description: row.description,
        photo: row.photo,
      } as RoomInterface;
    }
    return null;
  }

  async create(newRoom: RoomInterface): Promise<RoomInterface> {
    const [result] = await this.connection.execute<ResultSetHeader>(
      `INSERT INTO rooms (roomNumber, bedType, facilities, rate, offerPrice, status, description, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newRoom.roomNumber,
        newRoom.bedType,
        newRoom.facilities.join(", "),
        newRoom.rate,
        newRoom.offerPrice,
        newRoom.status,
        newRoom.description,
        newRoom.photo,
      ]
    );

    return {
      id: result.insertId.toString(),
      roomNumber: newRoom.roomNumber,
      bedType: newRoom.bedType,
      facilities: newRoom.facilities,
      rate: newRoom.rate,
      offerPrice: newRoom.offerPrice,
      status: newRoom.status,
      description: newRoom.description,
      photo: newRoom.photo,
    } as RoomInterface;
  }

  async update(
    id: string,
    updatedRoom: Partial<RoomInterface>
  ): Promise<RoomInterface | null> {
    const [result] = await this.connection.execute<ResultSetHeader>(
      `UPDATE rooms SET roomNumber = ?, bedType = ?, facilities = ?, rate = ?, offerPrice = ?, status = ?, description = ?, photo = ?
       WHERE id = ?`,
      [
        updatedRoom.roomNumber || null,
        updatedRoom.bedType || null,
        updatedRoom.facilities ? updatedRoom.facilities.join(", ") : null,
        updatedRoom.rate || null,
        updatedRoom.offerPrice || null,
        updatedRoom.status || null,
        updatedRoom.description || null,
        updatedRoom.photo || null,
        id,
      ]
    );

    return result.affectedRows > 0 ? this.getById(id) : null;
  }

  async delete(id: string): Promise<void> {
    await this.connection.execute<ResultSetHeader>(
      "DELETE FROM rooms WHERE id = ?",
      [id]
    );
  }
}
