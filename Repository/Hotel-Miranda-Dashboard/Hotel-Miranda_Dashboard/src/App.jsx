import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import LoginPage from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Users from "./Pages/Users/Users";
import Rooms from "./Pages/Rooms/Rooms";
import CreateRoom from "./Pages/CreateRoom/CreateRoom";
import PrivateRoute from "./Components/PrivateRoute";
import Bookings from "./Pages/Bookings/Bookings";
import EditUser from "./Pages/EditUser/EditUser";
import Contacts from "./Pages/Contacts/Contacts";
import EditBooking from "./Pages/EditBooking/EditBooking";
import "./App.css";
import EditRoom from "./Pages/EditRoom/EditRoom";
import { AuthProvider } from "./Components/Redux/authContext";
import { store } from "./Components/Redux/store";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <PrivateRoute>
                  <Bookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-booking/:id"
              element={
                <PrivateRoute>
                  <EditBooking />
                </PrivateRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <PrivateRoute>
                  <Rooms />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-room/:id"
              element={
                <PrivateRoute>
                  <EditRoom />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-room"
              element={
                <PrivateRoute>
                  <CreateRoom />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              }
            />

            <Route
              path="/contacts"
              element={
                <PrivateRoute>
                  <Contacts />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-user/:username"
              element={
                <PrivateRoute>
                  <EditUser />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
