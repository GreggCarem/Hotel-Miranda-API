import { Contact } from "../models/Contact";

export class ContactService {
  async getAll() {
    return await Contact.find();
  }

  async getById(id: string) {
    return await Contact.findById(id);
  }

  async create(newContact: any) {
    const contact = new Contact(newContact);
    return await contact.save();
  }

  async update(id: string, updatedContact: any) {
    return await Contact.findByIdAndUpdate(id, updatedContact, { new: true });
  }

  async delete(id: string) {
    return await Contact.findByIdAndDelete(id);
  }
}
