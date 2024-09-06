import React from "react";
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  updateUser,
  fetchUsers,
  selectAllUsers,
} from "../../Components/Redux/Slice/userSlice";
import { AppDispatch } from "../../Components/Redux/store";
import { User } from "../../Resources/Interface/users";

export default function EditUser() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isNewUser = username === "new";
  const users = useSelector(selectAllUsers);

  const userFromStore = users.find((u) => u.username === username);

  const [user, setUser] = useState<User>({
    full_name: "",
    start_date: "",
    job_position: "",
    job_description: "",
    phone: "",
    status: "Active",
    image: "",
    username: "",
    id: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!isNewUser && !userFromStore) {
      dispatch(fetchUsers());
    } else if (userFromStore) {
      setUser({
        ...userFromStore,
        id: userFromStore.id || "",
      });
    }
  }, [username, isNewUser, userFromStore, dispatch]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (isNewUser) {
      dispatch(createUser(user)).then(() => {
        navigate("/users");
      });
    } else {
      dispatch(updateUser(user)).then(() => {
        navigate("/users");
      });
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{isNewUser ? "Create New User" : "Edit User"}</h2>
      {user && (
        <>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Full Name:</label>
            <input
              type="text"
              name="full_name"
              value={user.full_name || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Start Date:</label>
            <input
              type="date"
              name="start_date"
              value={user.start_date || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Job Position:</label>
            <input
              type="text"
              name="job_position"
              value={user.job_position || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Phone:</label>
            <input
              type="text"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Status:</label>
            <select
              name="status"
              value={user.status || ""}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Photo URL:</label>
            <input
              type="text"
              name="image"
              value={user.image || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={handleSave} style={saveButtonStyle}>
              Save
            </button>
          </div>
        </>
      )}
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

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "10px",
};

const saveButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#007bff",
  color: "#fff",
};
