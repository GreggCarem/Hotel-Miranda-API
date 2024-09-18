import { User, IUser } from "../models/User";
import bcrypt from "bcrypt";

export class UserService {
  async getAll(): Promise<IUser[]> {
    return await User.find().exec();
  }

  async getById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  async create(newUser: IUser): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;
    const user = new User(newUser);
    return await user.save();
  }

  async update(id: string, updatedUser: Partial<IUser>): Promise<IUser | null> {
    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
    }
    return await User.findByIdAndUpdate(id, updatedUser, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id).exec();
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username }).exec();
  }
}
