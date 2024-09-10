import { Request, Response } from "express";
import {
  fetchAllUsers,
  fetchUserByUsername,
  addUser,
  updateUser,
  deleteUser,
} from "../services/userServices";
import { User } from "../interfaces/User";

export const getAllUsers = (req: Request, res: Response): void => {
  const users = fetchAllUsers();
  res.json(users);
};

export const getUserByUsername = (req: Request, res: Response): void => {
  const { username } = req.params;
  const user = fetchUserByUsername(username);
  if (!user) {
    res.status(404).json({ message: "User not found" });
  } else {
    res.json(user);
  }
};

export const createUser = (req: Request, res: Response): void => {
  const newUser: User = req.body;
  const users = addUser(newUser);
  res.status(201).json(users);
};

export const updateUserByUsername = (req: Request, res: Response): void => {
  const { username } = req.params;
  const updatedUser: Partial<User> = req.body;
  const user = updateUser(username, updatedUser);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  } else {
    res.json(user);
  }
};

export const removeUser = (req: Request, res: Response): void => {
  const { username } = req.params;
  const users = deleteUser(username);
  res.json(users);
};
