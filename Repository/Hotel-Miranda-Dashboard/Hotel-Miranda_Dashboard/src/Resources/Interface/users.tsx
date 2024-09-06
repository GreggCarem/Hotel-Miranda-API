export interface User {
  id?: string;
  username: string;
  password: string;
  full_name: string;
  job_position: string;
  job_description: string;
  email: string;
  phone: string;
  start_date: string;
  status: "Active" | "Inactive";
  image: string;
}
