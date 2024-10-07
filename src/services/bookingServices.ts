import { Connection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { IBooking } from "../models/Booking";

export class BookingService {
  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async getAll(): Promise<IBooking[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      `SELECT bookings.*, users.username, rooms.roomNumber 
       FROM bookings 
       INNER JOIN users ON bookings.userId = users.id 
       INNER JOIN rooms ON bookings.roomId = rooms.id`
    );

    return rows.map((row) => ({
      id: row.id.toString(),
      userId: row.userId,
      roomId: row.roomId,
      startDate: row.startDate,
      endDate: row.endDate,
      totalAmount: row.totalAmount.toString(),
      status: row.status,
      username: row.username,
      roomNumber: row.roomNumber,
    })) as unknown as IBooking[];
  }

  async getById(id: string): Promise<IBooking | null> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      `SELECT bookings.*, users.username, rooms.roomNumber 
       FROM bookings 
       INNER JOIN users ON bookings.userId = users.id 
       INNER JOIN rooms ON bookings.roomId = rooms.id 
       WHERE bookings.id = ?`,
      [id]
    );

    if (rows.length > 0) {
      const row = rows[0];
      return {
        id: row.id.toString(),
        userId: row.userId,
        roomId: row.roomId,
        startDate: row.startDate,
        endDate: row.endDate,
        totalAmount: row.totalAmount.toString(),
        status: row.status,
        username: row.username,
        roomNumber: row.roomNumber,
      } as unknown as IBooking;
    }
    return null;
  }

  async create(newBooking: IBooking): Promise<IBooking> {
    const [result] = await this.connection.execute<ResultSetHeader>(
      `INSERT INTO bookings (userId, roomId, startDate, endDate, totalAmount, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        newBooking.userId,
        newBooking.roomId,
        newBooking.startDate,
        newBooking.endDate,
        newBooking.totalAmount,
        newBooking.status,
      ]
    );

    return {
      ...newBooking,
      id: result.insertId.toString(),
    } as IBooking;
  }

  async update(
    id: string,
    updatedBooking: Partial<IBooking>
  ): Promise<IBooking | null> {
    const [result] = await this.connection.execute<ResultSetHeader>(
      `UPDATE bookings SET userId = ?, roomId = ?, startDate = ?, endDate = ?, totalAmount = ?, status = ? 
       WHERE id = ?`,
      [
        updatedBooking.userId || null,
        updatedBooking.roomId || null,
        updatedBooking.startDate || null,
        updatedBooking.endDate || null,
        updatedBooking.totalAmount || null,
        updatedBooking.status || null,
        id,
      ]
    );

    return result.affectedRows > 0 ? this.getById(id) : null;
  }

  async delete(id: string): Promise<void> {
    await this.connection.execute<ResultSetHeader>(
      "DELETE FROM bookings WHERE id = ?",
      [id]
    );
  }
}
