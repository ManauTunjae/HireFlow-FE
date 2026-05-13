import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Laddar...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Startsida (Kommer snart)</h1>} />
        <Route path="/login" element={<h1>Login-sida (Kommer snart)</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
