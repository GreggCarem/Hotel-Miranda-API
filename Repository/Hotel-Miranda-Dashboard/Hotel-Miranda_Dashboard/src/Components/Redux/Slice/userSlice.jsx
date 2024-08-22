import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// Initial state
const initialState = {
  users: [],
  status: "idle",
  error: null,
};

// Thunk for fetching users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("http://localhost:5003/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
});

// Thunk for creating a new user
export const createUser = createAsyncThunk("users/createUser", async (user) => {
  const newId = uuidv4();
  const newUser = { ...user, id: newId };

  const response = await fetch("http://localhost:5003/users", {
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
});

// Thunk for updating an existing user
export const updateUser = createAsyncThunk("users/updateUser", async (user) => {
  if (!user.id) {
    throw new Error("User ID is missing!");
  }

  const response = await fetch(`http://localhost:5003/users/${user.id}`, {
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
});

// Thunk for deleting a user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5003/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to delete user: ${id} - ${response.statusText}`
        );
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice for managing user-related state
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

// Selectors
export const selectAllUsers = (state) => state.users.users;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

export default usersSlice.reducer;
