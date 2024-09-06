import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/userSlice";
import bookingsReducer from "./Slice/bookingsSlice";
import roomsReducer from "./Slice/roomsSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    bookings: bookingsReducer,
    rooms: roomsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
