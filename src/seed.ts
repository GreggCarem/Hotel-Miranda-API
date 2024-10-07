import mysql from "mysql2/promise";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const connectionConfig = {
  host: process.env.SQL_HOST || "localhost",
  user: process.env.SQL_USER || "root",
  password: process.env.SQL_PASSWORD || "2734363410",
  database: process.env.SQL_DATABASE || "hotel_api_db",
};

const seedDatabase = async () => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log("Connected to MySQL");

    await dropTables(connection);
    await createTables(connection);

    const rooms = await seedRooms(connection);
    const users = await seedUsers(connection);
    await seedBookings(connection, users, rooms);
    await seedContacts(connection);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
  } finally {
    if (connection) await connection.end();
  }
};

const dropTables = async (connection: mysql.Connection) => {
  await connection.query("DROP TABLE IF EXISTS bookings;");
  await connection.query("DROP TABLE IF EXISTS contacts;");
  await connection.query("DROP TABLE IF EXISTS rooms;");
  await connection.query("DROP TABLE IF EXISTS users;");
  console.log("Dropped existing tables.");
};

const createTables = async (connection: mysql.Connection) => {
  const createUsersTable = `
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      full_name VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      photo VARCHAR(255),
      entryDate DATE NOT NULL,
      positionDescription VARCHAR(255),
      phone VARCHAR(30) NOT NULL,
      status VARCHAR(20) NOT NULL,
      position VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createRoomsTable = `
    CREATE TABLE rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      roomNumber VARCHAR(10) NOT NULL UNIQUE,
      bedType VARCHAR(50) NOT NULL,
      facilities TEXT,
      rate DECIMAL(10, 2) NOT NULL,
      offerPrice DECIMAL(10, 2),
      status VARCHAR(20) NOT NULL,
      description TEXT,
      photo VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createBookingsTable = `
    CREATE TABLE bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      roomId INT,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      totalAmount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (roomId) REFERENCES rooms(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createContactsTable = `
    CREATE TABLE contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATETIME NOT NULL,
      name VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      archiveStatus BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await connection.query(createUsersTable);
  await connection.query(createRoomsTable);
  await connection.query(createBookingsTable);
  await connection.query(createContactsTable);
  console.log("Tables created successfully.");
};

const seedRooms = async (connection: mysql.Connection) => {
  const rooms: any[] = [];

  for (let i = 0; i < 20; i++) {
    let roomNumber: string;

    do {
      roomNumber = faker.string.numeric(3);
    } while (rooms.some((room) => room[0] === roomNumber));

    const room = [
      roomNumber,
      faker.helpers.arrayElement(["Single", "Double", "King", "Queen"]),
      faker.helpers
        .arrayElements(
          ["Wi-Fi", "TV", "Mini Bar", "Air Conditioning", "Room Service"],
          3
        )
        .join(", "),
      parseFloat(faker.commerce.price()),
      parseFloat(faker.commerce.price()),
      faker.helpers.arrayElement(["available", "booked", "maintenance"]),
      faker.lorem.sentences(2),
      faker.image.url(),
    ];

    const query = `
      INSERT INTO rooms (roomNumber, bedType, facilities, rate, offerPrice, status, description, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      query,
      room
    );

    console.log("Insert result:", result);

    rooms.push([result.insertId, ...room]);
  }

  console.log("Rooms seeded successfully!");
  console.log(
    "Available room IDs for bookings:",
    rooms.map((room) => room[0])
  );
  return rooms;
};
const seedUsers = async (connection: mysql.Connection) => {
  const users: any[] = [];

  for (let i = 0; i < 20; i++) {
    const hashedPassword = await bcrypt.hash("admin", 10);
    const user = [
      faker.internet.userName(),
      faker.internet.email(),
      faker.person.fullName(),
      hashedPassword,
      faker.image.avatar(),
      faker.date.past(),
      faker.person.jobTitle(),
      faker.phone.number(),
      "active",
      faker.person.jobTitle(),
    ];

    const query = `
      INSERT INTO users (username, email, full_name, password, photo, entryDate, positionDescription, phone, status, position)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      query,
      user
    );

    users.push([result.insertId, ...user]);
  }

  console.log("Users seeded successfully!");
  return users;
};
const seedBookings = async (
  connection: mysql.Connection,
  users: any[],
  rooms: any[]
) => {
  const roomIds = rooms.map((room) => room[0]);

  for (let i = 0; i < 20; i++) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const randomUserId = users[randomUserIndex][0];

    const randomRoomId = roomIds[Math.floor(Math.random() * roomIds.length)];

    const startDate = faker.date.future();
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const booking = [
      randomUserId,
      randomRoomId,
      startDate,
      endDate,
      parseFloat(faker.commerce.price()),
      "confirmed",
    ];

    const query = `
      INSERT INTO bookings (userId, roomId, startDate, endDate, totalAmount, status)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    await connection.query(query, booking);
  }

  console.log("Bookings seeded successfully!");
};

const seedContacts = async (connection: mysql.Connection) => {
  for (let i = 0; i < 20; i++) {
    const contact = [
      new Date().toISOString().slice(0, 19).replace("T", " "),
      faker.person.fullName(),
      faker.lorem.sentences(2),
      faker.datatype.boolean(),
    ];

    const query = `
      INSERT INTO contacts (date, name, message, archiveStatus)
      VALUES (?, ?, ?, ?);
    `;

    await connection.query(query, contact);
  }

  console.log("Contacts seeded successfully!");
};

seedDatabase();
