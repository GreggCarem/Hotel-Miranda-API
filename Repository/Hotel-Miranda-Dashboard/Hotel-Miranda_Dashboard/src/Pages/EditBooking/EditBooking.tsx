import React from "react";
import { CSSProperties } from "react";
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createBooking,
  updateBooking,
  selectAllBookings,
  fetchBookings,
  selectBookingsStatus,
} from "../../Components/Redux/Slice/bookingsSlice";
import { AppDispatch } from "../../Components/Redux/store";

export default function EditBooking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const isNewBooking = id === "new";
  const bookings = useSelector(selectAllBookings);
  const bookingStatus = useSelector(selectBookingsStatus);

  const [booking, setBooking] = useState({
    guest: "",
    orderDate: "",
    checkIn: "",
    checkOut: "",
    specialRequest: "",
    room_type: "",
    status: "Pending",
    photo: "",
    id: "",
    number: 0,
  });

  useEffect(() => {
    if (bookingStatus === "idle") {
      dispatch(fetchBookings());
    } else if (bookingStatus === "succeeded") {
      if (!isNewBooking) {
        const foundBooking = bookings.find((b) => String(b.id) === String(id));

        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          alert("Booking not found!");
          navigate("/bookings");
        }
      }
    }
  }, [id, isNewBooking, bookings, bookingStatus, dispatch, navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBooking((prevBooking) => ({
      ...prevBooking,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (isNewBooking) {
      dispatch(createBooking(booking)).then(() => {
        navigate("/bookings");
      });
    } else {
      dispatch(updateBooking(booking)).then(() => {
        navigate("/bookings");
      });
    }
  };

  if (bookingStatus === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        {isNewBooking ? "Create New Booking" : "Edit Booking"}
      </h2>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Guest:</label>
        <input
          type="text"
          name="guest"
          value={booking.guest || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Order Date:</label>
        <input
          type="date"
          name="orderDate"
          value={booking.orderDate || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Check In:</label>
        <input
          type="date"
          name="checkIn"
          value={booking.checkIn || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Check Out:</label>
        <input
          type="date"
          name="checkOut"
          value={booking.checkOut || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Special Request:</label>
        <textarea
          name="specialRequest"
          value={booking.specialRequest || ""}
          onChange={handleChange}
          rows={4}
          style={textareaStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Room Type:</label>
        <input
          type="text"
          name="room_type"
          value={booking.room_type || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Status:</label>
        <select
          name="status"
          value={booking.status || ""}
          onChange={handleChange}
          style={selectStyle}
        >
          <option value="Pending">Pending</option>
          <option value="Booked">Booked</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refund">Refund</option>
        </select>
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Photo:</label>
        <input
          type="text"
          name="photo"
          value={booking.photo || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      {booking.photo && (
        <div style={formGroupStyle}>
          <label style={labelStyle}>Preview:</label>
          <img
            src={booking.photo}
            alt="Selected"
            style={{ maxWidth: "100%", height: "auto", borderRadius: "4px" }}
          />
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <button onClick={handleSave} style={saveButtonStyle}>
          Save
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  padding: "20px",
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const titleStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
  textAlign: "center",
};

const formGroupStyle = {
  marginBottom: "15px",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: 600,
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  fontSize: "16px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxSizing: "border-box" as "border-box",
};

const selectStyle = {
  width: "100%",
  padding: "8px",
  fontSize: "16px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxSizing: "border-box" as "border-box",
};

const textareaStyle = {
  width: "100%",
  padding: "8px",
  fontSize: "16px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxSizing: "border-box" as "border-box",
  resize: "vertical" as "vertical",
};

const saveButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
};
