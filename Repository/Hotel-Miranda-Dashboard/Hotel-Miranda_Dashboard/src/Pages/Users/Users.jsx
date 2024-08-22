import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HeaderMenu } from "../../Components/Header-menu/Header-menu";
import { SideBar } from "../../Components/Side-Bar/Side-Bar";
import {
  fetchUsers,
  deleteUser,
  selectAllUsers,
  selectUsersStatus,
  selectUsersError,
} from "../../Components/Redux/Slice/userSlice";
import "./Users.scss";

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(selectAllUsers);
  const userStatus = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredUsers = users
    .filter((user) => {
      if (filter === "active") {
        return user.status && user.status.toLowerCase() === "active";
      } else if (filter === "inactive") {
        return user.status && user.status.toLowerCase() === "inactive";
      }
      return true;
    })
    .filter((user) => {
      if (searchTerm === "") return true;
      return (
        user.full_name &&
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  let content;

  if (userStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (userStatus === "succeeded") {
    content = (
      <table className="users-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Full Name</th>
            <th>Start Date</th>
            <th>Job Position</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id || user.username}>
                {" "}
                <td>
                  <img
                    src={user.image ? user.image.trim() : ""}
                    alt={user.full_name || "N/A"}
                    className="user-photo"
                    onClick={() => navigate(`/edit-user/${user.id}`)}
                  />
                </td>
                <td>{user.full_name || "N/A"}</td>
                <td>{user.start_date || "N/A"}</td>
                <td>{user.job_position || "N/A"}</td>
                <td>{user.phone || "N/A"}</td>
                <td>{user.status || "N/A"}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  } else if (userStatus === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <div className="users-page">
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
        <div className="filters">
          <button onClick={() => setFilter("all")}>All Employees</button>
          <button onClick={() => setFilter("active")}>Active Employees</button>
          <button onClick={() => setFilter("inactive")}>
            Inactive Employees
          </button>
          <input
            type="text"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => navigate("/edit-user/new")}>
            Create New User
          </button>
        </div>
        {content}
      </div>
    </div>
  );
}
