import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HeaderMenu } from "../../Components/Header-menu/Header-menu";
import { SideBar } from "../../Components/Side-Bar/Side-Bar";
import { Room } from "../../Resources/Interface/room";
import { AppDispatch } from "../../Components/Redux/store";
import {
  fetchRooms,
  selectAllRooms,
  selectRoomsStatus,
  selectRoomsError,
} from "../../Components/Redux/Slice/roomsSlice";
import "./Rooms.scss";

export default function Rooms() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const rooms: Room[] = useSelector(selectAllRooms);
  const roomsStatus = useSelector(selectRoomsStatus);
  const error = useSelector(selectRoomsError);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomsStatus === "idle") {
      dispatch(fetchRooms());
    }
  }, [roomsStatus, dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber.includes(searchTerm) ||
      room.bedType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: number) => {
    navigate(`/edit-room/${id}`);
  };

  const handleCreateNew = () => {
    navigate("/edit-room/new");
  };

  let content;

  if (roomsStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (roomsStatus === "succeeded") {
    content = (
      <table className="rooms-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Room Number</th>
            <th>ID</th>
            <th>Bed Type</th>
            <th>Facilities</th>
            <th>Rate</th>
            <th>Offer Price</th>
            <th>Status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room.id} onClick={() => handleEdit(room.id)}>
              <td>
                <img
                  src={room.photo}
                  alt={`Room ${room.roomNumber}`}
                  className="room-photo"
                />
              </td>
              <td>{room.roomNumber}</td>
              <td>{room.id}</td>
              <td>{room.bedType}</td>
              <td>{room.facilities.join(", ")}</td>
              <td>{room.rate}</td>
              <td>{room.offerPrice}</td>
              <td>{room.status}</td>
              <td>{room.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else if (roomsStatus === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <div className="rooms-page">
      <SideBar isSidebarOpen={isSidebarOpen} />
      <HeaderMenu
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
      <div
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="actions">
          <button className="create-button" onClick={handleCreateNew}>
            Create New Room
          </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by room number or bed type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {content}
      </div>
    </div>
  );
}
