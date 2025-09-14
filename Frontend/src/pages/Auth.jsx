import { useTransactions } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";

export default function Auth() {
  const { login, register } = useTransactions();
  const { theme, toggleTheme } = useTheme();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
      
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 px-3 py-1 text-sm rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md transition-colors duration-300"
      >
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          {isRegister ? "Register" : "Login"}
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
          >
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700 dark:text-gray-300">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(prev => !prev)}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
