import { Router } from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  removeContact,
} from "../controllers/contactsController";

const router = Router();

router.get("/contacts", getAllContacts);
router.get("/contacts/:id", getContactById);
router.post("/contacts", createContact);
router.put("/contacts/:id", updateContactById);
router.delete("/contacts/:id", removeContact);

export default router;
