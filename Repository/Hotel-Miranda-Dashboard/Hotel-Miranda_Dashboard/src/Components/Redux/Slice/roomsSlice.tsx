import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Room } from "../../../Resources/Interface/room";

interface RoomsState {
  rooms: Room[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RoomsState = {
  rooms: [],
  status: "idle",
  error: null,
};

export const fetchRooms = createAsyncThunk<Room[]>(
  "rooms/fetchRooms",
  async () => {
    const response = await fetch("http://localhost:3000/rooms");
    if (!response.ok) {
      throw new Error("Failed to fetch rooms");
    }
    return (await response.json()) as Room[];
  }
);

export const createRoom = createAsyncThunk<Room, Partial<Room>>(
  "rooms/createRoom",
  async (room) => {
    const response = await fetch("http://localhost:3000/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(room),
    });

    if (!response.ok) {
      throw new Error("Failed to create room");
    }

    return (await response.json()) as Room;
  }
);

export const updateRoom = createAsyncThunk<Room, Room>(
  "rooms/updateRoom",
  async (room) => {
    const response = await fetch(`http://localhost:3000/rooms/${room.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(room),
    });

    if (!response.ok) {
      throw new Error("Failed to update room");
    }

    return (await response.json()) as Room;
  }
);

export const deleteRoom = createAsyncThunk<number, number>(
  "rooms/deleteRoom",
  async (id) => {
    const response = await fetch(`http://localhost:3000/rooms/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete room");
    }
    return id;
  }
);

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
        state.status = "succeeded";
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(createRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        state.rooms.push(action.payload);
      })
      .addCase(updateRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        const index = state.rooms.findIndex(
          (room) => room.id === action.payload.id
        );
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      .addCase(deleteRoom.fulfilled, (state, action: PayloadAction<number>) => {
        state.rooms = state.rooms.filter((room) => room.id !== action.payload);
      });
  },
});

export const selectAllRooms = (state: RootState): Room[] => state.rooms.rooms;
export const selectRoomsStatus = (state: RootState): RoomsState["status"] =>
  state.rooms.status;
export const selectRoomsError = (state: RootState): RoomsState["error"] =>
  state.rooms.error;

export default roomsSlice.reducer;
