import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { useTransactions } from "./context/AppContext";

export default function App() {
  const { user } = useTransactions();

  return (
    <Routes>
      <Route path="/auth" element={!user ? <Auth /> : <Dashboard />} />

      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
      />

      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
