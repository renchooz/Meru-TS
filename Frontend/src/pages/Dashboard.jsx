// Dashboard.jsx
import { useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import { useTransactions } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

export default function Dashboard() {
  const { fetchTransactions, logout, user } = useTransactions();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div
      className={`min-h-screen p-4 md:p-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } transition-colors`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded-lg border shadow-sm bg-gray-200 dark:bg-gray-700 dark:text-white hover:opacity-80 transition"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Form */}
        <div
          className={`shadow-md rounded-xl p-4 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } transition-colors`}
        >
          <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
          <TransactionForm />
        </div>

        {/* Transaction Table */}
        <div
          className={`shadow-md rounded-xl p-4 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } transition-colors`}
        >
          <h2 className="text-lg font-semibold mb-4">Transactions</h2>
          <div className="overflow-x-auto">
            <TransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
}
