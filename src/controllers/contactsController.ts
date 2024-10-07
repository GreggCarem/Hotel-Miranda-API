import express, { Request, Response } from "express";
import { ContactService } from "../services/contactServices";
import { Connection } from "mysql2/promise";

export function contactsController(connection: Connection) {
  const router = express.Router();
  const contactService = new ContactService(connection);

  router.get("/", async (req: Request, res: Response) => {
    try {
      const contacts = await contactService.getAll();
      res.status(200).json({ data: contacts });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error retrieving contacts", error: err });
    }
  });

  router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
      const contact = await contactService.getById(req.params.id);
      if (contact) {
        res.status(200).json({ data: contact });
      } else {
        res.status(404).json({ message: "Contact not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error retrieving contact", error: err });
    }
  });

  router.post("/", async (req: Request, res: Response) => {
    try {
      const newContact = req.body;
      const createdContact = await contactService.create(newContact);
      res.status(201).json({ data: createdContact });
    } catch (err) {
      res.status(500).json({ message: "Error creating contact", error: err });
    }
  });

  router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
      const updatedContact = await contactService.update(
        req.params.id,
        req.body
      );
      if (updatedContact) {
        res.status(200).json({ data: updatedContact });
      } else {
        res.status(404).json({ message: "Contact not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error updating contact", error: err });
    }
  });

  router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
      await contactService.delete(req.params.id);
      res.status(200).json({ message: "Contact deleted successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting contact", error: err });
    }
  });

  return router;
}
