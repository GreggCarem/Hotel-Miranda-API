import fs from "fs";
import path from "path";
import { Contact } from "../interfaces/Contact";

const contactsFilePath = path.join(__dirname, "../data/contacts.json");

const readContactsFile = (): Contact[] => {
  const data = fs.readFileSync(contactsFilePath, "utf-8");
  return JSON.parse(data);
};

const writeContactsFile = (data: Contact[]): void => {
  fs.writeFileSync(contactsFilePath, JSON.stringify(data, null, 2), "utf-8");
};

export const fetchAllContacts = (): Contact[] => {
  return readContactsFile();
};

export const fetchContactById = (id: string): Contact | undefined => {
  const contacts = readContactsFile();
  return contacts.find((contact) => contact.id === id);
};

export const addContact = (newContact: Contact): Contact[] => {
  const contacts = readContactsFile();
  contacts.push(newContact);
  writeContactsFile(contacts);
  return contacts;
};

export const updateContactById = (
  id: string,
  updatedContact: Partial<Contact>
): Contact | undefined => {
  const contacts = readContactsFile();
  const index = contacts.findIndex((contact) => contact.id === id);

  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...updatedContact };
    writeContactsFile(contacts);
    return contacts[index];
  }
  return undefined;
};

export const deleteContactById = (id: string): Contact[] => {
  let contacts = readContactsFile();
  contacts = contacts.filter((contact) => contact.id !== id);
  writeContactsFile(contacts);
  return contacts;
};
