import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../store";

interface User {
  id: string;
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

interface UsersState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const response = await fetch("http://localhost:3000/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  }
);

export const createUser = createAsyncThunk<User, Omit<User, "id">>(
  "users/createUser",
  async (user) => {
    const newId = uuidv4();
    const newUser = { ...user, id: newId };

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json();
  }
);

export const updateUser = createAsyncThunk<User, User>(
  "users/updateUser",
  async (user) => {
    if (!user.id) {
      throw new Error("User ID is missing!");
    }

    const response = await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return response.json();
  }
);

export const deleteUser = createAsyncThunk<string, string>(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to delete user: ${id} - ${response.statusText}`
        );
      }
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export const selectAllUsers = (state: RootState) => state.users.users;
export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectUsersError = (state: RootState) => state.users.error;

export default usersSlice.reducer;
