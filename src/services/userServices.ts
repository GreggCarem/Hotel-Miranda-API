import fs from "fs";
import path from "path";
import { User } from "../interfaces/User";

const dbPath = path.join(__dirname, "../data/db.json");

export const readData = (): any => {
  try {
    const jsonData = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error reading the db.json file at path: ${dbPath}`, error);
    throw error;
  }
};

const writeData = (data: any) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(dbPath, jsonData, "utf-8");
};

export class UserService {
  getAll(): User[] {
    const data = readData();
    return data.users;
  }

  getById(id: string): User | null {
    const data = readData();
    const user = data.users.find((userData: User) => userData.id === id);
    if (!user) {
      throw new Error(`User with id: ${id} not found`);
    }
    return user;
  }

  create(newUser: User): User {
    const data = readData();
    data.users.push(newUser);
    writeData(data);
    return newUser;
  }

  update(id: string, updatedUser: User): User {
    const data = readData();
    const userIndex = data.users.findIndex((user: User) => user.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id: ${id} not found`);
    }
    data.users[userIndex] = updatedUser;
    writeData(data);
    return updatedUser;
  }

  delete(id: string): void {
    const data = readData();
    const userIndex = data.users.findIndex((user: User) => user.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id: ${id} not found`);
    }
    data.users.splice(userIndex, 1);
    writeData(data);
  }
}
