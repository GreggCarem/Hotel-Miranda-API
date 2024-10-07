import { Connection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcrypt";
import { User } from "../interfaces/User";

export class UserService {
  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async getAll(): Promise<User[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      "SELECT * FROM users"
    );
    return rows as User[];
  }

  async getById(id: string): Promise<User | null> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async create(newUser: User): Promise<User> {
    if (!newUser.password) {
      throw new Error("Password is required");
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const [result] = await this.connection.execute<ResultSetHeader>(
      `INSERT INTO users (username, email, full_name, password, photo, entryDate, positionDescription, phone, status, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newUser.username,
        newUser.email,
        newUser.full_name,
        hashedPassword,
        newUser.photo,
        newUser.entryDate,
        newUser.positionDescription,
        newUser.phone,
        newUser.status,
        newUser.position,
      ]
    );

    return { ...newUser, id: result.insertId.toString() };
  }

  async update(id: string, updatedUser: Partial<User>): Promise<User | null> {
    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
    }

    const [result] = await this.connection.execute<ResultSetHeader>(
      `UPDATE users SET username = ?, email = ?, full_name = ?, password = ?, photo = ?, entryDate = ?, positionDescription = ?, phone = ?, status = ?, position = ?
       WHERE id = ?`,
      [
        updatedUser.username || null,
        updatedUser.email || null,
        updatedUser.full_name || null,
        updatedUser.password || null,
        updatedUser.photo || null,
        updatedUser.entryDate || null,
        updatedUser.positionDescription || null,
        updatedUser.phone || null,
        updatedUser.status || null,
        updatedUser.position || null,
        id,
      ]
    );

    return result.affectedRows > 0 ? this.getById(id) : null;
  }

  async delete(id: string): Promise<void> {
    await this.connection.execute<ResultSetHeader>(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }
}
