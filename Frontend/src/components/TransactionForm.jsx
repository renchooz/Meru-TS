// TransactionForm.jsx
import { useState } from "react";
import { useTransactions } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

export default function TransactionForm() {
  const { addTransaction } = useTransactions();
  const { theme } = useTheme();

  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
    payee: "",
    category: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTransaction(form);
    setForm({ date: "", description: "", amount: "", payee: "", category: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className={`w-full border p-2 rounded transition-colors ${
          theme === "dark"
            ? "bg-gray-700 text-white border-gray-600"
            : "bg-gray-50 text-black border-gray-300"
        }`}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className={`w-full border p-2 rounded transition-colors ${
          theme === "dark"
            ? "bg-gray-700 text-white border-gray-600"
            : "bg-gray-50 text-black border-gray-300"
        }`}
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className={`w-full border p-2 rounded transition-colors ${
          theme === "dark"
            ? "bg-gray-700 text-white border-gray-600"
            : "bg-gray-50 text-black border-gray-300"
        }`}
        required
      />
      <input
        type="text"
        name="payee"
        placeholder="Payee"
        value={form.payee}
        onChange={handleChange}
        className={`w-full border p-2 rounded transition-colors ${
          theme === "dark"
            ? "bg-gray-700 text-white border-gray-600"
            : "bg-gray-50 text-black border-gray-300"
        }`}
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className={`w-full border p-2 rounded transition-colors ${
          theme === "dark"
            ? "bg-gray-700 text-white border-gray-600"
            : "bg-gray-50 text-black border-gray-300"
        }`}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition"
      >
        Add
      </button>
    </form>
  );
}
