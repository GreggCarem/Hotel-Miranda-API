import fs from "fs";
import path from "path";
import { User } from "../interfaces/User";

const usersFilePath = path.join(__dirname, "../data/users.json");

const readUsersFile = (): User[] => {
  const data = fs.readFileSync(usersFilePath, "utf-8");
  return JSON.parse(data);
};

const writeUsersFile = (data: User[]): void => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), "utf-8");
};

export const fetchAllUsers = (): User[] => {
  return readUsersFile();
};

export const fetchUserByUsername = (username: string): User | undefined => {
  const users = readUsersFile();
  return users.find((user) => user.username === username);
};

export const addUser = (newUser: User): User[] => {
  const users = readUsersFile();
  users.push(newUser);
  writeUsersFile(users);
  return users;
};

export const updateUser = (
  username: string,
  updatedUser: Partial<User>
): User | undefined => {
  const users = readUsersFile();
  const index = users.findIndex((user) => user.username === username);

  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    writeUsersFile(users);
    return users[index];
  }
  return undefined;
};

export const deleteUser = (username: string): User[] => {
  let users = readUsersFile();
  users = users.filter((user) => user.username !== username);
  writeUsersFile(users);
  return users;
};
