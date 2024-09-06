import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import HotelLogo from "./../../assets/Logos/Hotel-Logo.jpeg";
import { useAuth } from "../../Components/Redux/authContext";
import { User } from "../../Resources/Interface/users";

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #135846;
`;

const Header = styled.header`
  background-color: white;
  padding: 3rem 2rem;
  border-radius: 40px;
  width: 100%;
  max-width: 25rem;
  text-align: center;
`;

const Title = styled.h1`
  font-family: "Poppins", sans-serif;
  color: black;
  margin-bottom: 3rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  width: 90%;
`;

const Label = styled.label`
  color: black;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  margin-bottom: 0.8rem;
`;

const Input = styled.input`
  font-size: 1rem;
  border-radius: 10px;
  border: 2px solid #023a2b;
  padding: 0.5rem;
  width: 100%;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #0aebaf;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
`;

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/users?username=${username}&password=${password}`
      );
      const users: User[] = await response.json();

      if (users.length > 0) {
        const user = users[0];
        dispatch({ type: "LOGIN", payload: user });
        localStorage.setItem("loggedInUsername", username);
        alert("Welcome and good luck: " + user.full_name.toUpperCase());
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <LoginPageContainer>
      <Header>
        <Title>
          <img
            src={HotelLogo}
            alt="Login Illustration"
            style={{ width: "5rem", height: "auto", marginBottom: "-1.5rem" }}
          />
          Login
        </Title>
        <Form onSubmit={handleLogin}>
          <FormGroup>
            <Label>Username:</Label>
            <Input
              type="text"
              value={username}
              placeholder="admin"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Password:</Label>
            <Input
              type="password"
              value={password}
              placeholder="admin"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit">Login</Button>
        </Form>
      </Header>
    </LoginPageContainer>
  );
}
