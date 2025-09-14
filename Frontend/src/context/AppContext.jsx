import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";
const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Axios instance with Authorization header
  const api = axios.create({
    baseURL: API_URL,
  });

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });


  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  /* ----------------- AUTH ----------------- */
  async function fetchProfile() {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Profile fetch failed:", err);
      setUser(null);
      setToken(""); 
    }
  }

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setTransactions([]);
  };

  /* ------------- TRANSACTIONS ------------- */
  const fetchTransactions = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/transactions", { params });
      setTransactions(res.data.data);
      return res.data;
    } catch (err) {
      console.error("Fetch transactions failed", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (txn) => {
    const res = await api.post("/transactions", txn);
    setTransactions((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateTransaction = async (id, updates) => {
    const res = await api.put(`/transactions/${id}`, updates);
    setTransactions((prev) =>
      prev.map((t) => (t._id === id ? res.data : t))
    );
    return res.data;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <TransactionContext.Provider
      value={{
        user,
        token,
        transactions,
        loading,
        register,
        login,
        logout,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
