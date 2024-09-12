import { Request, Response, Router } from "express";
import { ContactService } from "../services/contactServices";
import { Contact, updateContact } from "../interfaces/Contact";
import { authenticateTokenMiddleware } from "../middleware/authMiddleware";

export const contactsController = Router();

contactsController.use(authenticateTokenMiddleware);

contactsController.get("", async (req: Request, res: Response) => {
  const contactService = new ContactService();
  return res.status(200).send({ data: contactService.getAll() });
});

contactsController.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const contactService = new ContactService();
    try {
      return res
        .status(200)
        .send({ data: contactService.getById(req.params.id) });
    } catch (error) {
      return res.status(404).send({ message: "Error getting Contact ID" });
    }
  }
);

contactsController.post("", async (req: Request, res: Response) => {
  const contactService = new ContactService();
  const newContact: Contact = req.body;

  try {
    const createdContact = contactService.create(newContact);
    return res.status(201).send({ data: createdContact });
  } catch (error) {
    return res.status(500).send({ message: "Error creating the contact" });
  }
});

contactsController.patch(
  "/archive-status",
  async (req: Request, res: Response) => {
    const contactService = new ContactService();
    const payload: updateContact = req.body;

    try {
      const updatedContact = contactService.updateArchiveStatus(payload);
      return res.status(200).send({ data: updatedContact });
    } catch (error) {
      return res.status(404).send({ message: "Contact not found" });
    }
  }
);

contactsController.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const contactService = new ContactService();
    const contactId = req.params.id;

    try {
      contactService.delete(contactId);
      return res.status(200).send({ message: "Contact deleted successfully" });
    } catch (error) {
      return res.status(404).send({ message: "Error deleting Contact" });
    }
  }
);
