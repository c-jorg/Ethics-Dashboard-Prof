import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPass: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear errors on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isRegister) {
            if (formData.password !== formData.confirmPass) {
                setError("Passwords do not match!");
                return;
            }

            try {
                const response = await axios.post('http://213.255.209.162:5000/api/professors/signup', { //port 5173 for shared db
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                setSuccess("Registered successfully!");
                console.log(response.data); // Log success message from backend
            } catch (err) {
                setError("Registration failed. Please try again.");
                console.error("Registration error:", err);
            }
        } else {
            try {
                const response = await axios.post('http://213.255.209.162:5000/api/professors/login', { //port 5173 for shared db
                    email: formData.email,
                    password: formData.password
                });

                // Store user info in localStorage or context
                localStorage.setItem('professorData', JSON.stringify(response.data.professor));
                setSuccess("Signed in successfully!");

                // Redirect to professor dashboard

                navigate('/prof-dashboard');



            } catch (err) {
                setError(err.response?.data?.message || "Login failed. Please check your credentials.");
                console.error("Login error:", err);
            }
        }

        setFormData({ name: "", email: "", password: "", confirmPass: "" }); // Clear form
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4">
          {isRegister ? "Register" : "Sign In"}
        </h1>

        {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
        {success && <p className="text-green-500 font-semibold mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {isRegister && (
            <div>
              <label className="block text-gray-700 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-gray-700 font-semibold">Confirm Password</label>
              <input
                type="password"
                name="confirmPass"
                value={formData.confirmPass}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-bold transition hover:bg-indigo-700"
          >
            {isRegister ? "Register" : "Sign In"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setSuccess("");
          }}
          className="mt-4 text-indigo-600 hover:underline font-semibold"
        >
          {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
