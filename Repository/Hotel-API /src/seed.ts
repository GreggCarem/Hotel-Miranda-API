import mongoose from "mongoose";
import { User } from "./models/User";
import { Booking } from "./models/Booking";
import { Room } from "./models/Rooms";
import { Contact } from "./models/Contact";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
//Uri
const mongoUri =
  "mongodb+srv://gregorten1:2cPbAxeXZ8zaMKf8@hoteldb.l3pj1.mongodb.net/?retryWrites=true&w=majority&appName=hotelDB";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    seedDatabase();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
  });

const dropCollections = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    try {
      await collection.drop();
      console.log(`${key} collection dropped successfully.`);
    } catch (err) {
      if ((err as Error).message === "ns not found") {
        console.log(`${key} collection does not exist.`);
      } else {
        console.error(
          `Error dropping ${key} collection:`,
          (err as Error).message
        );
      }
    }
  }
};

const seedRooms = async () => {
  const rooms = [];

  for (let i = 0; i < 20; i++) {
    const room = new Room({
      roomNumber: faker.string.numeric(3),
      bedType: faker.helpers.arrayElement([
        "Single",
        "Double",
        "King",
        "Queen",
      ]),
      facilities: faker.helpers.arrayElements(
        ["Wi-Fi", "TV", "Mini Bar", "Air Conditioning", "Room Service"],
        3
      ),
      rate: faker.commerce.price(),
      offerPrice: faker.commerce.price(),
      status: faker.helpers.arrayElement([
        "available",
        "booked",
        "maintenance",
      ]),
      description: faker.lorem.sentences(2),
      photo: faker.image.url(),
    });
    const savedRoom = await room.save();
    rooms.push(savedRoom);
  }

  console.log("Rooms seeded successfully!");
  seedUsers(rooms);
};
const seedUsers = async (rooms: any[]) => {
  const users = [];

  for (let i = 0; i < 20; i++) {
    const hashedPassword = await bcrypt.hash("admin", 10);
    const user = new User({
      username: faker.internet.userName(),
      full_name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
      photo: faker.image.avatar(),
      entryDate: faker.date.past(),
      positionDescription: faker.person.jobTitle(),
      phone: faker.phone.number(),
      status: "active",
      position: faker.person.jobTitle(),
    });
    const savedUser = await user.save();
    users.push(savedUser);
  }

  console.log("Users seeded successfully!");
  seedBookings(users, rooms);
};
const seedBookings = async (users: any[], rooms: any[]) => {
  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
    const booking = new Booking({
      userId: randomUser._id,
      roomId: randomRoom._id,
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      totalAmount: faker.commerce.price(),
      status: "confirmed",
    });
    await booking.save();
  }

  console.log("Bookings seeded successfully!");
  seedContacts();
};

const seedContacts = async () => {
  for (let i = 0; i < 20; i++) {
    const contact = new Contact({
      date: faker.date.recent().toISOString(),
      name: faker.person.fullName(),
      message: faker.lorem.sentences(2),
      archiveStatus: faker.datatype.boolean(),
    });
    await contact.save();
  }

  console.log("Contacts seeded successfully!");
  mongoose.disconnect();
};

const seedDatabase = async () => {
  await dropCollections();
  await seedRooms();
};
