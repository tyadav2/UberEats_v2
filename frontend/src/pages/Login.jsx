import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const apiUrl = "http://localhost:5000/api/users/login";
      const response = await axios.post(apiUrl, { email, password });

      // ✅ Save to localStorage (optional for persistence)
      localStorage.setItem("customerToken", JSON.stringify(response.data.token));

      // ✅ Dispatch to Redux store
      dispatch(login({ token: response.data.token, user: response.data.user }));

      console.log("Customer login successful:", response.data);
      alert("Login successful!");

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