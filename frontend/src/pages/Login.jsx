import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // API endpoint for customer login
      const apiUrl = "http://localhost:5000/api/users/login";

      // Sending login request
      const response = await axios.post(apiUrl, { email, password });

      // Store token in localStorage
      localStorage.setItem("customerToken", JSON.stringify(response.data.token));

      console.log("Customer login successful:", response.data);
      alert("Login successful!");

      // Redirect to customer dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        alert(error.response.data.message || "Invalid credentials!");
      } else {
        alert("Login failed! Please check your internet connection.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Navbar />

      {/* Uber Eats Branding */}
      <h1 className="text-4xl font-bold mb-6">
        Uber <span className="text-green-600">Eats</span>
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Customer Login</h2>

        {/* Login Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="flex flex-col space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;