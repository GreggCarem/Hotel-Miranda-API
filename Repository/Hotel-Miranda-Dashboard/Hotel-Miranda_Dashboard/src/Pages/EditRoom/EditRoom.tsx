import React from "react";
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  selectAllRooms,
  fetchRooms,
  selectRoomsStatus,
} from "../../Components/Redux/Slice/roomsSlice";
import { AppDispatch } from "../../Components/Redux/store";
import { Room } from "../../Resources/Interface/room";

export default function EditRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isNewRoom = id === "new";
  const rooms = useSelector(selectAllRooms);
  const roomsStatus = useSelector(selectRoomsStatus);

  const [room, setRoom] = useState<Room>({
    photo: "",
    roomNumber: "",
    id: isNewRoom ? uuidv4() : "",
    bedType: "",
    facilities: [],
    rate: "",
    offerPrice: "",
    status: "Available",
    description: "",
  });

  useEffect(() => {
    if (roomsStatus === "idle") {
      dispatch(fetchRooms());
    } else if (roomsStatus === "succeeded") {
      if (!isNewRoom) {
        const foundRoom = rooms.find((r) => r.id === id);
        if (foundRoom) {
          setRoom(foundRoom);
        }
      }
    }
  }, [id, isNewRoom, rooms, roomsStatus, dispatch]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "facilities") {
      setRoom((prevRoom) => ({
        ...prevRoom,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setRoom((prevRoom) => ({
        ...prevRoom,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    if (isNewRoom) {
      dispatch(createRoom(room)).then(() => {
        navigate("/rooms");
      });
    } else {
      dispatch(updateRoom(room)).then(() => {
        navigate("/rooms");
      });
    }
  };

  const handleDelete = () => {
    if (!isNewRoom) {
      dispatch(deleteRoom(room.id)).then(() => {
        navigate("/rooms");
      });
    }
  };

  if (roomsStatus === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{isNewRoom ? "Create New Room" : "Edit Room"}</h2>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Room Number:</label>
        <input
          type="text"
          name="roomNumber"
          value={room.roomNumber || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>ID:</label>
        <input
          type="text"
          name="id"
          value={room.id || ""}
          onChange={handleChange}
          style={inputStyle}
          disabled={!isNewRoom}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Bed Type:</label>
        <input
          type="text"
          name="bedType"
          value={room.bedType || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Facilities (comma-separated):</label>
        <input
          type="text"
          name="facilities"
          value={(room.facilities || []).join(", ")}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Rate:</label>
        <input
          type="text"
          name="rate"
          value={room.rate || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Offer Price:</label>
        <input
          type="text"
          name="offerPrice"
          value={room.offerPrice || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Status:</label>
        <select
          name="status"
          value={room.status || ""}
          onChange={handleChange}
          style={selectStyle}
        >
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Description:</label>
        <textarea
          name="description"
          value={room.description || ""}
          onChange={handleChange}
          rows={4}
          style={textareaStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Photo URL:</label>
        <input
          type="text"
          name="photo"
          value={room.photo || ""}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      {room.photo && (
        <div style={formGroupStyle}>
          <label style={labelStyle}>Preview:</label>
          <img
            src={room.photo}
            alt="Selected"
            style={{ maxWidth: "100%", height: "auto", borderRadius: "4px" }}
          />
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <button onClick={handleSave} style={saveButtonStyle}>
          Save
        </button>
        {!isNewRoom && (
          <button onClick={handleDelete} style={deleteButtonStyle}>
            Delete
          </button>
        )}
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

const deleteButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "#dc3545",
  color: "#fff",
  marginLeft: "10px",
};
