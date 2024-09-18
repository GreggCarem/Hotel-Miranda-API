import { Contact, ContactInterface } from "../models/Contact";

export class ContactService {
  async getAll(): Promise<ContactInterface[]> {
    return await Contact.find().exec();
  }

  async getById(id: string): Promise<ContactInterface | null> {
    return await Contact.findById(id).exec();
  }

  async create(newContact: ContactInterface): Promise<ContactInterface> {
    const contact = new Contact(newContact);
    return await contact.save();
  }

  async update(
    id: string,
    updatedContact: Partial<ContactInterface>
  ): Promise<ContactInterface | null> {
    return await Contact.findByIdAndUpdate(id, updatedContact, {
      new: true,
    }).exec();
  }

  async delete(id: string): Promise<void> {
    await Contact.findByIdAndDelete(id).exec();
  }
}
