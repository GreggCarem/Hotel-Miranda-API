import { Connection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { ContactInterface } from "../models/Contact";

export class ContactService {
  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async getAll(): Promise<ContactInterface[]> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      "SELECT * FROM contacts"
    );

    return rows.map((row) => ({
      id: row.id.toString(),
      date: row.date,
      name: row.name,
      message: row.message,
      archiveStatus: row.archiveStatus,
    })) as ContactInterface[];
  }

  async getById(id: string): Promise<ContactInterface | null> {
    const [rows] = await this.connection.query<RowDataPacket[]>(
      "SELECT * FROM contacts WHERE id = ?",
      [id]
    );

    if (rows.length > 0) {
      const row = rows[0];
      return {
        id: row.id.toString(),
        date: row.date,
        name: row.name,
        message: row.message,
        archiveStatus: row.archiveStatus,
      } as ContactInterface;
    }
    return null;
  }

  async create(
    newContact: Omit<ContactInterface, "id">
  ): Promise<ContactInterface> {
    const [result] = await this.connection.execute<ResultSetHeader>(
      `INSERT INTO contacts (date, name, message, archiveStatus) 
       VALUES (?, ?, ?, ?)`,
      [
        newContact.date,
        newContact.name,
        newContact.message,
        newContact.archiveStatus,
      ]
    );

    return {
      ...newContact,
      id: result.insertId.toString(),
    } as ContactInterface;
  }

  async update(
    id: string,
    updatedContact: Partial<ContactInterface>
  ): Promise<ContactInterface | null> {
    const [result] = await this.connection.execute<ResultSetHeader>(
      `UPDATE contacts SET date = ?, name = ?, message = ?, archiveStatus = ? 
       WHERE id = ?`,
      [
        updatedContact.date || null,
        updatedContact.name || null,
        updatedContact.message || null,
        updatedContact.archiveStatus || null,
        id,
      ]
    );

    return result.affectedRows > 0 ? this.getById(id) : null;
  }

  async delete(id: string): Promise<void> {
    await this.connection.execute<ResultSetHeader>(
      "DELETE FROM contacts WHERE id = ?",
      [id]
    );
  }
}
