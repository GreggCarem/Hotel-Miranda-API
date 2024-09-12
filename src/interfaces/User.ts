export interface User {
  id: string;
  username: string;
  fullName: string;
  password?: string;
  email: string;
  photo: string;
  entryDate: string;
  positionDescription: string;
  phone: string;
  status: string;
  position: string;
}

export interface Jwt {
  username: string;
  email: string;
}
