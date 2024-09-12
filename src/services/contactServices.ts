import fs from "fs";
import path from "path";
import { Contact, updateContact } from "../interfaces/Contact";

const dbPath = path.join(__dirname, "../data/db.json");

const readData = (): any => {
  const jsonData = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(jsonData);
};

const writeData = (data: any) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(dbPath, jsonData, "utf-8");
};

export class ContactService {
  getAll(): Contact[] {
    const data = readData();
    return data.contacts;
  }

  getById(id: string): Contact {
    const data = readData();
    const contact = data.contacts.find(
      (contactData: Contact) => contactData.id === id
    );
    if (!contact) {
      throw new Error(`Contact with id: ${id} not found`);
    }
    return contact;
  }

  create(newContact: Contact): Contact {
    const data = readData();
    data.contacts.push(newContact);
    writeData(data);
    return newContact;
  }

  updateArchiveStatus(payload: updateContact): Contact {
    const data = readData();
    const contactIndex = data.contacts.findIndex(
      (contact: Contact) => contact.id === payload.id
    );
    if (contactIndex !== -1) {
      data.contacts[contactIndex].archiveStatus = payload.archiveStatus;
      writeData(data);
      return data.contacts[contactIndex];
    } else {
      throw new Error(`Contact with id: ${payload.id} not found`);
    }
  }

  delete(id: string): void {
    const data = readData();
    const contactIndex = data.contacts.findIndex(
      (contact: Contact) => contact.id === id
    );
    if (contactIndex === -1) {
      throw new Error(`Contact with id: ${id} not found`);
    }
    data.contacts.splice(contactIndex, 1);
    writeData(data);
  }
}
