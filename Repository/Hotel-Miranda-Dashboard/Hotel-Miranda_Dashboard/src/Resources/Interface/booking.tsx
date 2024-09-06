export interface Booking {
  id: string;
  guest: string;
  photo: string;
  orderDate: string;
  checkIn: string;
  checkOut: string;
  specialRequest?: string;
  room_type: string;
  number: number;
  status: "Booked" | "Cancelled" | "Pending";
}
