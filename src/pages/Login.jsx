import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (!email || !password) {
      setMessage({ type: "error", text: "Email and password are required" });
      return;
    }

    // Read users from localStorage
    const usersJSON = localStorage.getItem("users");
    const users = usersJSON ? JSON.parse(usersJSON) : [];

    // Find existing user by email
    const existing = users.find((u) => u.email === email);

    if (!existing) {
      // Auto-create user (simple local flow)
      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      setMessage({ type: "success", text: "Account created and logged in (local)" });
    } else if (existing.password !== password) {
      setMessage({ type: "error", text: "Invalid email or password (local)" });
      return;
    } else {
      setMessage({ type: "success", text: "Login successful (local)" });
    }

    // Save current user session
    const currentUser = { email, loggedIn: true, loggedAt: Date.now() };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    setTimeout(() => navigate("/videos"), 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {/* Display success/error messages */}
        {message && (
          <div
            className={`max-w-md mx-auto mb-4 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        {/* <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
