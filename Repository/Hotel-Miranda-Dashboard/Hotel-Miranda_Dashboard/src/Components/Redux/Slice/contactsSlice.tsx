import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Contact } from "../../../Resources/Interface/contact";

interface ContactsState {
  contacts: Contact[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ContactsState = {
  contacts: [],
  status: "idle",
  error: null,
};

export const fetchContacts = createAsyncThunk<Contact[]>(
  "contacts/fetchContacts",
  async () => {
    const response = await fetch("http://localhost:3000/reviews");
    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }
    return (await response.json()) as Contact[];
  }
);

export const createContact = createAsyncThunk<Contact, Omit<Contact, "id">>(
  "contacts/createContact",
  async (newContact) => {
    const response = await fetch("http://localhost:3000/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContact),
    });

    if (!response.ok) {
      throw new Error("Failed to create contact");
    }

    return (await response.json()) as Contact;
  }
);

export const deleteContact = createAsyncThunk<string, string>(
  "contacts/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contact: ${response.statusText}`);
      }

      return id;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchContacts.fulfilled,
        (state, action: PayloadAction<Contact[]>) => {
          state.status = "succeeded";
          state.contacts = action.payload;
        }
      )
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(
        createContact.fulfilled,
        (state, action: PayloadAction<Contact>) => {
          state.contacts.push(action.payload);
        }
      )
      .addCase(
        deleteContact.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.contacts = state.contacts.filter(
            (contact) => contact.id !== action.payload
          );
        }
      );
  },
});

export const selectAllContacts = (state: RootState): Contact[] =>
  state.contacts.contacts;
export const selectContactsStatus = (
  state: RootState
): ContactsState["status"] => state.contacts.status;
export const selectContactsError = (state: RootState): string | null =>
  state.contacts.error;

export default contactsSlice.reducer;
