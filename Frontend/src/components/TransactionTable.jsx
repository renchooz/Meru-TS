import { useEffect, useState } from "react";
import { useTransactions } from "@/context/AppContext";

export default function TransactionTable() {
  const {
    transactions,
    deleteTransaction,
    fetchTransactions,
    updateTransaction,
    loading,
  } = useTransactions();

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    payee: "",
    fromDate: "",
    toDate: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: "",
    payee: "",
    category: "",
  });

  const loadTransactions = async () => {
    const res = await fetchTransactions({ page, limit, ...filters });
    setTotalPages(res.totalPages);
  };

  useEffect(() => {
    loadTransactions();
  }, [page, filters]);

  const startEdit = (txn) => {
    setEditingId(txn._id);
    setFormData({
      date: txn.date.slice(0, 10),
      description: txn.description,
      amount: txn.amount,
      payee: txn.payee,
      category: txn.category,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    await updateTransaction(editingId, formData);
    setEditingId(null);
    setFormData({ date: "", description: "", amount: "", payee: "", category: "" });
    loadTransactions();
  };

  if (loading)
    return <p className="text-gray-500 dark:text-gray-300">Loading...</p>;
  if (!transactions.length)
    return <p className="text-gray-500 dark:text-gray-300">No transactions found.</p>;

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          placeholder="Search"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white flex-1 min-w-[120px]"
        />
        <input
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white flex-1 min-w-[120px]"
        />
        <input
          placeholder="Payee"
          value={filters.payee}
          onChange={(e) => setFilters({ ...filters, payee: e.target.value })}
          className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white flex-1 min-w-[120px]"
        />
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={() => setPage(1)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead className="bg-gray-200 dark:bg-gray-700 text-left text-gray-900 dark:text-gray-100">
            <tr>
              <th className="p-2 border dark:border-gray-600">ID</th>
              <th className="p-2 border dark:border-gray-600">Date</th>
              <th className="p-2 border dark:border-gray-600">Description</th>
              <th className="p-2 border dark:border-gray-600">Amount</th>
              <th className="p-2 border dark:border-gray-600">Payee</th>
              <th className="p-2 border dark:border-gray-600">Category</th>
              <th className="p-2 border dark:border-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr
                key={txn._id}
                className="border-t border-gray-300 dark:border-gray-600"
              >
                <td className="p-2 border dark:border-gray-600">{txn._id.slice(-6)}</td>

                {editingId === txn._id ? (
                  <td colSpan="6">
                    {/* Mobile-friendly edit card */}
                    <div className="flex flex-col gap-2 p-2 border rounded dark:border-gray-600 dark:bg-gray-800">
                      {["date", "description", "amount", "payee", "category"].map(
                        (field) => (
                          <input
                            key={field}
                            type={
                              field === "date"
                                ? "date"
                                : field === "amount"
                                ? "number"
                                : "text"
                            }
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="border px-2 py-1 w-full rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            placeholder={field}
                          />
                        )
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="p-2 border dark:border-gray-600">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 border dark:border-gray-600">{txn.description}</td>
                    <td className="p-2 border dark:border-gray-600">₹{txn.amount}</td>
                    <td className="p-2 border dark:border-gray-600">{txn.payee}</td>
                    <td className="p-2 border dark:border-gray-600">{txn.category}</td>
                    <td className="p-2 border dark:border-gray-600 space-x-2">
                      <button
                        onClick={() => startEdit(txn)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTransaction(txn._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center gap-2 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
        >
          Prev
        </button>
        <span className="px-2">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
