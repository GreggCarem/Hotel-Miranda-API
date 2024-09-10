import { Router } from "express";
import {
  getAllUsers,
  getUserByUsername,
  createUser,
  updateUserByUsername,
  removeUser,
} from "../controllers/usercontroller";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:username", getUserByUsername);
router.post("/users", createUser);
router.put("/users/:username", updateUserByUsername);
router.delete("/users/:username", removeUser);

export default router;
