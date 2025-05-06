import React, { useState } from "react";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Form Submitted", formData);
  };

  return (
    <div className="flex min-h-screen flex-col p-6">
      {/* Header Banner */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <div className="font-lusitana text-2xl font-bold text-white">Ethics Dashboard</div>
      </div>

      {/* Main Content */}
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h1 className="font-lusitana text-2xl font-bold text-blue-500 mb-6 text-center">
              Register Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block font-lusitana font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block font-lusitana font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block font-lusitana font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block font-lusitana font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPass"
                  value={formData.confirmPass}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-5 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
              >
                Register Account
              </button>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Log in
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
