import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HotelLogo from "./../../assets/Logos/Hotel-Logo.jpeg";
import "./Side-Bar.scss";
import UserLogin from "../../assets/users.json";
import Spinner from "../../assets/Spinner.gif";
import {
  LuLayoutDashboard,
  FaAngleDown,
  FaAngleUp,
  SlKey,
  TbCalendarCheck,
  MdOutlinePersonOutline,
  PiPuzzlePieceBold,
  FaHeart,
  MdOutlineAddCircleOutline,
} from "../React-Icons";

export const SideBar = ({ isSidebarOpen }) => {
  const currentYear = new Date().getFullYear();
  const [showNewRoom, setShowRooms] = useState(false);
  const [user, setUser] = useState(null);

  const toggleRooms = (e) => {
    e.preventDefault();
    setShowRooms(!showNewRoom);
  };

  useEffect(() => {
    const loggedInUsername = localStorage.getItem("loggedInUsername");
    const userData = loggedInUsername
      ? UserLogin.find((user) => user.username === loggedInUsername)
      : null;

    if (userData) {
      setUser(userData);
    } else {
      console.log("No User");
    }
  }, []);
  const handleCreateNew = () => {
    navigate("/edit-room/new");
  };

  return (
    <div className={`sidebar-container ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar">
        <div className="sidebar__tittle">
          <img
            src={HotelLogo}
            alt="Hotel Logo"
            style={{
              width: "5rem",
              height: "auto",
              marginBottom: "-1.5rem",
            }}
          />
          <h1>Travel</h1>
          <h2>Hotel Admin Dashboard</h2>
        </div>
        <ul>
          <li>
            <LuLayoutDashboard />
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <TbCalendarCheck />
            <Link to="/bookings">Bookings</Link>
          </li>
          <li>
            <SlKey />
            <Link className="rooms" to="/rooms">
              Rooms
            </Link>
          </li>
          <div className="new__rooms" onClick={toggleRooms}>
            {showNewRoom ? <FaAngleUp /> : <FaAngleDown />}
            {showNewRoom && (
              <div className="create__room">
                <MdOutlineAddCircleOutline />
                <Link to="/create-room">Create Room</Link>
              </div>
            )}
          </div>

          <li>
            <MdOutlinePersonOutline />
            <Link to="/contacts">Contacts</Link>
          </li>
          <li>
            <PiPuzzlePieceBold />
            <Link to="/users">Users</Link>
          </li>
        </ul>
        {user ? (
          <div className="user__info">
            <img src={user.image} alt="User" className="user__photo" />
            <div className="user__info__details">
              <h3>{user.full_name}</h3>
              <p>{user.email}</p>
              <Link to={`/edit-user/${user.username}`}>
                <button className="user__info__details__btn">Edit</button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="user__info">
            <img src={Spinner} alt="loading" />
          </div>
        )}
        <div className="sidebar__footer">
          <h3>Travel Hotel Admin Dashboard</h3>
          <h4>© {currentYear} All rights reserved.</h4>
          <h5>
            Made with <FaHeart /> by Peterdraw{" "}
          </h5>
        </div>
      </div>
    </div>
  );
};
