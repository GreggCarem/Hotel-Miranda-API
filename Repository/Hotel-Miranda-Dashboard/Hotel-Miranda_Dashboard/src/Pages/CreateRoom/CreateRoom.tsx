import React, { useState, ChangeEvent, FormEvent } from "react";
import { HeaderMenu } from "../../Components/Header-menu/Header-menu";
import { SideBar } from "../../Components/Side-Bar/Side-Bar";
import "./CreateRoom.scss";

interface RoomData {
  photo: string;
  roomNumber: string;
  id: string;
  bedType: string;
  facilities: string[];
  rate: string;
  offerPrice: string;
  status: string;
  description: string;
}

export default function CreateRoom() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [roomData, setRoomData] = useState<RoomData>({
    photo: "",
    roomNumber: "",
    id: "",
    bedType: "",
    facilities: [],
    rate: "",
    offerPrice: "",
    status: "",
    description: "",
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRoomData({
      ...roomData,
      [name]: value,
    });
  };

  const handleFacilitiesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomData({
      ...roomData,
      facilities: e.target.value.split(",").map((item) => item.trim()),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleSave = () => {
    console.log("Room data saved:", roomData);
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-page">
      <SideBar isSidebarOpen={isSidebarOpen} />
      <HeaderMenu
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="room-container">
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">Room Number:</label>
          <input
            type="number"
            name="roomNumber"
            value={roomData.roomNumber}
            onChange={handleChange}
            className="input"
          />

          <label className="label">Bed Type:</label>
          <input
            type="text"
            name="bedType"
            value={roomData.bedType}
            onChange={handleChange}
            className="input"
          />

          <label className="label">Facilities:</label>
          <input
            type="text"
            name="facilities"
            value={roomData.facilities.join(", ")}
            onChange={handleFacilitiesChange}
            className="input"
          />

          <label className="label">Rate:</label>
          <input
            type="text"
            name="rate"
            value={roomData.rate}
            onChange={handleChange}
            className="input"
          />

          <label className="label">Offer Price:</label>
          <input
            type="text"
            name="offerPrice"
            value={roomData.offerPrice}
            onChange={handleChange}
            className="input"
          />

          <label className="label">Status:</label>
          <input
            type="text"
            name="status"
            value={roomData.status}
            onChange={handleChange}
            className="input"
          />

          <label className="label">Description:</label>
          <textarea
            name="description"
            value={roomData.description}
            onChange={handleChange}
            rows={4}
            className="textarea"
          />

          <button type="submit" className="button">
            Save Room
          </button>
        </form>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Room Information</h2>
            <p>
              <img src={roomData.photo} alt="Room" className="room-image" />
            </p>
            <p>
              <strong>Room Number:</strong> {roomData.roomNumber}
            </p>
            <p>
              <strong>Bed Type:</strong> {roomData.bedType}
            </p>
            <p>
              <strong>Facilities:</strong> {roomData.facilities.join(", ")}
            </p>
            <p>
              <strong>Rate:</strong> {roomData.rate}
            </p>
            <p>
              <strong>Offer Price:</strong> {roomData.offerPrice}
            </p>
            <p>
              <strong>Status:</strong> {roomData.status}
            </p>
            <p>
              <strong>Description:</strong> {roomData.description}
            </p>
            <div className="modal-buttons">
              <button onClick={handleSave} className="button">
                Save
              </button>
              <button onClick={handleClose} className="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
