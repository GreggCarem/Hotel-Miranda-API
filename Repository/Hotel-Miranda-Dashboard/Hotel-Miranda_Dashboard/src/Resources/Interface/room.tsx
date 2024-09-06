export interface Room {
  id: string;
  photo: string;
  roomNumber: string;
  bedType: string;
  facilities: string[];
  rate: string;
  offerPrice?: string;
  status: "Available" | "Occupied" | "Maintenance";
  description: string;
}
