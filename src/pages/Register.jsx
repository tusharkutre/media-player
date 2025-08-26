import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [message , setMessage] = useState("");
    
    const[registerData, setRegisterData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("Registration data submitted:", registerData);
        // Handle registration logic here

        try {
            // sending post api request to backend
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });
            const data = await response.json();

            
      if (response.ok) {
        console.log("Registration successful!");
        setMessage({ type: "success", text: data.message });

        // Reset form
        setRegisterData({
          email: "",
          password: "",
        });


      } else {
        console.error("Registration failed:", data.message);
        setMessage({ type: "error", text: data.message });
      }
            console.log("Registration successful:", data);
        } catch (error) {
            console.error("Registration error:", error);
        }

        setRegisterData({
            email: "",
            password: "",
        });

    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

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
              value={registerData.email}
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
              value={registerData.password}
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
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;