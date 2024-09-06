import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Booking } from "../../../Resources/Interface/booking";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";

interface BookingsState {
  bookings: Booking[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  status: "idle",
  error: null,
};

export const fetchBookings = createAsyncThunk<Booking[]>(
  "bookings/fetchBookings",
  async () => {
    const response = await fetch("http://localhost:3000/bookings");
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    return (await response.json()) as Booking[];
  }
);

export const createBooking = createAsyncThunk<Booking, Omit<Booking, "id">>(
  "bookings/createBooking",
  async (booking) => {
    const newId = uuidv4();
    const newBooking: Booking = { ...booking, id: newId };

    const response = await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBooking),
    });

    if (!response.ok) {
      throw new Error("Failed to create booking");
    }

    return (await response.json()) as Booking;
  }
);

export const updateBooking = createAsyncThunk<Booking, Booking>(
  "bookings/updateBooking",
  async (booking) => {
    if (!booking.id) {
      throw new Error("Booking id is missing!");
    }

    const response = await fetch(
      `http://localhost:3000/bookings/${booking.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update booking");
    }

    return (await response.json()) as Booking;
  }
);

export const deleteBooking = createAsyncThunk<string, string>(
  "bookings/deleteBooking",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/bookings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to delete booking: ${id} - ${response.statusText}`
        );
      }
      return id;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.status = "succeeded";
          state.bookings = action.payload;
        }
      )
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(
        createBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.bookings.push(action.payload);
        }
      )
      .addCase(
        updateBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          const index = state.bookings.findIndex(
            (booking) => booking.id === action.payload.id
          );
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteBooking.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.bookings = state.bookings.filter(
            (booking) => booking.id !== action.payload
          );
        }
      );
  },
});

export const selectAllBookings = (state: RootState): Booking[] =>
  state.bookings.bookings;
export const selectBookingsStatus = (
  state: RootState
): BookingsState["status"] => state.bookings.status;
export const selectBookingsError = (state: RootState): string | null =>
  state.bookings.error;

export default bookingsSlice.reducer;
