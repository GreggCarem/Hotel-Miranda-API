export interface User {
  id: string;
  username: string;
  full_name: string;
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
