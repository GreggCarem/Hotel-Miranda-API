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

    const insertId = result.insertId;
    return { ...newUser, id: insertId.toString() };
  }

  async update(id: string, updatedUser: Partial<User>): Promise<User | null> {
    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
    }

    const [result] = await this.connection.execute<ResultSetHeader>(
      `UPDATE users SET username = ?, email = ?, full_name = ?, password = ?, photo = ?, entryDate = ?, positionDescription = ?, phone = ?, status = ?, position = ?
       WHERE id = ?`,
      [
        updatedUser.username,
        updatedUser.email,
        updatedUser.full_name,
        updatedUser.password,
        updatedUser.photo,
        updatedUser.entryDate,
        updatedUser.positionDescription,
        updatedUser.phone,
        updatedUser.status,
        updatedUser.position,
        id,
      ]
    );

    const affectedRows = result.affectedRows;
    return affectedRows > 0 ? this.getById(id) : null;
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
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }
}
