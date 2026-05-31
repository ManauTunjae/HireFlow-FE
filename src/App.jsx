import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import JobBoard from "./pages/JobBoard";
import Dashboard from "./pages/Dashboard";

function App() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobBoard />} />
        <Route
          path="/login"
          element={
            <h1 className="p-10 text-3xl font-bold text-indigo-600">
              Login-page (Coming soon) 🔑{" "}
            </h1>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
              <h1 className="p-10 text-3xl font-bold text-emerald-600">
                This dashboard is protected 🔐
              </h1>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<h1 className="p-10 text-red-500">404 - Page not found</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;
