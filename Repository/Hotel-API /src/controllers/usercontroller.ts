import express, { Request, Response } from "express";
import { UserService } from "../services/userServices";
import { authenticateTokenMiddleware } from "../middleware/authMiddleware";
import { Connection } from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export function usersController(connection: Connection) {
  const router = express.Router();

  const userService = new UserService(connection);

  router.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    try {
      const user = await userService.findByUsername(username);

      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { username: user.username, email: user.email },
        process.env.SECRET_KEY || "default_secret_key",
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({ token });
    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  });

  router.use(authenticateTokenMiddleware);

  router.get("/me", async (req: Request, res: Response) => {
    try {
      const user = await userService.findByUsername(req.user!.username);
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ message: "Error retrieving user", error: err });
    }
  });

  router.get("/", async (req: Request, res: Response) => {
    try {
      const users = await userService.getAll();
      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ message: "Error retrieving users", error: err });
    }
  });

  router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
      const user = await userService.getById(req.params.id);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error retrieving user", error: err });
    }
  });

  router.post("/", async (req: Request, res: Response) => {
    try {
      const newUser = req.body;
      if (!newUser.username || !newUser.password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const createdUser = await userService.create(newUser);
      res.status(201).json({ user: createdUser });
    } catch (err) {
      res.status(500).json({ message: "Error creating user", error: err });
    }
  });

  router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
      const updatedUser = req.body;
      const result = await userService.update(req.params.id, updatedUser);
      res.status(result ? 200 : 404).json({ user: result || "User not found" });
    } catch (err) {
      res.status(500).json({ message: "Error updating user", error: err });
    }
  });

  router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
      await userService.delete(req.params.id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting user", error: err });
    }
  });

  return router;
}
