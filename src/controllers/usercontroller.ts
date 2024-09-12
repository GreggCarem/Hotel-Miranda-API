import express from "express";
import jwt from "jsonwebtoken";
import { Request, Response, Router } from "express";
import { UserService } from "../services/userServices";
import { User } from "../interfaces/User";
import { createHash } from "crypto";
import { authenticateTokenMiddleware } from "../middleware/authMiddleware";

export const usersController = express.Router();
usersController.post("/login", (req: Request, res: Response) => {
  const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret_key";

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const passwordReq = createHash("sha256").update(password).digest("hex");
  const passwordHard = createHash("sha256").update("admin").digest("hex");

  if (username === "admin" && passwordReq === passwordHard) {
    const payload = { username };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

usersController.use(authenticateTokenMiddleware);

usersController.get("", async (req: Request, res: Response) => {
  const userService = new UserService();
  return res.status(200).send({ data: userService.getAll() });
});

usersController.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const userService = new UserService();
    try {
      return res.status(200).send({ data: userService.getById(req.params.id) });
    } catch (error) {
      return res.status(404).send({ message: "Error User ID" });
    }
  }
);

usersController.post("", async (req: Request, res: Response) => {
  const userService = new UserService();
  const newUser: User = req.body;

  if (newUser.password) {
    const hashedPassword = createHash("sha256")
      .update(newUser.password)
      .digest("hex");
    newUser.password = hashedPassword;
  }

  try {
    const createdUser = userService.create(newUser);
    return res.status(201).send({ data: createdUser });
  } catch (error) {
    return res.status(500).send({ message: "Error creating  User" });
  }
});

usersController.put(
  "/:id",
  async (req: Request<{ id: string }, {}, User>, res: Response) => {
    const userService = new UserService();
    const userId = req.params.id;
    const updatedUserData: User = req.body;

    try {
      const updatedUser = userService.update(userId, updatedUserData);
      if (updatedUser) {
        return res.status(200).send({ data: updatedUser });
      } else {
        return res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      return res.status(500).send({ message: "Error updating User" });
    }
  }
);

usersController.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const userService = new UserService();
    const userId = req.params.id;

    try {
      userService.delete(userId);
      return res.status(200).send({ message: "User deleted successfully!!!" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).send({ message: error.message });
      } else {
        return res.status(500).send({ message: "Error deleting  User" });
      }
    }
  }
);
