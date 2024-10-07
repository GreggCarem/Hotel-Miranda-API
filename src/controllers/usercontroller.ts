import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserService } from "../services/userServices";
import { authenticateTokenMiddleware } from "../middleware/authMiddleware";

export const usersController = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret_key";

usersController.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const userService = new UserService();
    const user = await userService.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { username: user.username, email: user.email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

usersController.use(authenticateTokenMiddleware);

usersController.get("/me", async (req: Request, res: Response) => {
  try {
    const userService = new UserService();
    const username = req.user?.username;

    if (!username) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const user = await userService.findByUsername(username);
    if (user) {
      return res.status(200).json({ data: user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

usersController.get("/", async (req: Request, res: Response) => {
  try {
    const userService = new UserService();
    const users = await userService.getAll();
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

usersController.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userService = new UserService();
      const user = await userService.getById(req.params.id);

      if (user) {
        return res.status(200).json({ data: user });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(`Error retrieving user with ID ${req.params.id}:`, error);
      return res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
);
usersController.post("/", async (req: Request, res: Response) => {
  const userService = new UserService();
  const newUser = req.body;

  if (
    !newUser.username ||
    !newUser.email ||
    !newUser.full_name ||
    !newUser.password
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const createdUser = await userService.create(newUser);
    return res.status(201).json({ data: createdUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Error creating user", error: error });
  }
});

usersController.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userService = new UserService();
      const updatedUser = req.body;

      if (updatedUser.password) {
        updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
      }

      const result = await userService.update(req.params.id, updatedUser);
      if (result) {
        return res.status(200).json({ data: result });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(`Error updating user with ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Error updating user" });
    }
  }
);

usersController.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userService = new UserService();
      await userService.delete(req.params.id);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(`Error deleting user with ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Error deleting user" });
    }
  }
);
