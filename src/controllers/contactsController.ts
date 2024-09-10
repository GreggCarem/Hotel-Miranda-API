import { Request, Response } from "express";

import {
  updateContactById as updateContactByIdService,
  fetchAllContacts,
  fetchContactById,
  addContact,
  deleteContactById,
} from "../services/contactServices";
import { Contact } from "../interfaces/Contact";

export const getAllContacts = (req: Request, res: Response): void => {
  const contacts = fetchAllContacts();
  res.json(contacts);
};

export const getContactById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const contact = fetchContactById(id);
  if (!contact) {
    res.status(404).json({ message: "Contact not found" });
  } else {
    res.json(contact);
  }
};

export const createContact = (req: Request, res: Response): void => {
  const newContact: Contact = { id: Date.now().toString(), ...req.body };
  const contacts = addContact(newContact);
  res.status(201).json(contacts);
};

export const updateContactById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedContact: Partial<Contact> = req.body;

  const contact = updateContactByIdService(id, updatedContact);

  if (!contact) {
    res.status(404).json({ message: "Contact not found" });
  } else {
    res.json(contact);
  }
};

export const removeContact = (req: Request, res: Response): void => {
  const { id } = req.params;
  const contacts = deleteContactById(id);
  res.json(contacts);
};
