import express from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserService } from "../services/userServices";
import bcrypt from "bcrypt";
import { authenticateTokenMiddleware } from "../middleware/authMiddleware";

export const usersController = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret_key";

usersController.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const userService = new UserService();
  const user = await userService.findByUsername(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { username: user.username, email: user.email };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  return res.status(200).json({ token });
});

usersController.use(authenticateTokenMiddleware);

usersController.get("/", async (req: Request, res: Response) => {
  const userService = new UserService();
  const users = await userService.getAll();
  return res.status(200).json({ data: users });
});

usersController.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const userService = new UserService();
    const user = await userService.getById(req.params.id);
    if (user) {
      return res.status(200).json({ data: user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
);

usersController.post("/", async (req: Request, res: Response) => {
  const userService = new UserService();
  const newUser = req.body;
  try {
    const createdUser = await userService.create(newUser);
    return res.status(201).json({ data: createdUser });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }
});

usersController.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const userService = new UserService();
    try {
      const updatedUser = await userService.update(req.params.id, req.body);
      if (updatedUser) {
        return res.status(200).json({ data: updatedUser });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error updating user" });
    }
  }
);

usersController.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const userService = new UserService();
    try {
      await userService.delete(req.params.id);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting user" });
    }
  }
);
