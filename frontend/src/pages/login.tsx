import { useState } from "react";
import { Button, Label, TextInput, Card, Radio } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbarr from "../components/navbar";

export default function Login() {
   const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000); // clear after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "register") {
        const res = await axios.post(
          "http://localhost:3000/api/auth/register",
          { username, password }
        );
        console.log("User registered:", res.data);
        showNotification("Registration successful! Please log in.");
        setMode("login");
        setPassword("");
      } else {
        const res = await axios.post("http://localhost:3000/api/auth/login", {
          username,
          password,
        });

        console.log("Login success, token:", res.data.token);
        localStorage.setItem("token", res.data.token);
        showNotification("Login successful!");

        // Redirect to dashboard
        navigate("/dashboard"); 
       
      }
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || "Request failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {/* Notification above the card */}
      {notification && (
        <div className="bg-green-100 text-green-800 p-2 text-center rounded">
          {notification}
        </div>
      )}

      <Card className="w-full max-w-md bg-white">
        <h1 className="text-2xl font-bold text-center mb-4">
          {mode === "login" ? "Login" : "Register"}
        </h1>

        {/* Mode selector */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <Radio
              id="login"
              name="mode"
              value="login"
              checked={mode === "login"}
              onChange={() => setMode("login")}
            />
            <Label htmlFor="login">Login</Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              id="register"
              name="mode"
              value="register"
              checked={mode === "register"}
              onChange={() => setMode("register")}
            />
            <Label htmlFor="register">Register</Label>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="username">Username</Label>
            <TextInput
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit">
            {mode === "login" ? "Sign In" : "Register"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
