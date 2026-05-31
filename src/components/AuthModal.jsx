import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, OnClose }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        setError("Registration coming soon, try Log In instead!");
        setLoading(false);
        return;
      }

      const result = await login(formData.email, formData.password);

      if (result.success) {
        onclose();
        // Just nu skickar vi dem till /dashboard, men i framtiden kan vi lägga en if-sats här:
        // if (user.role === 'candidate') { navigate('/candidate-dashboard') }
        navigate("/dashboard");
      } else {
        setError(result.message || "Invalid credential!");
      }
    } catch (error) {
      setError("Something wentwrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Modalkortet */}
      <div className="bg-white text-gray-900 w-full max-w-sm rounded-2xl shadow-2xl p-8 relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Stängknapp */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>

        {/* Titel */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {isRegister
              ? "Sign up to track your applications"
              : "Sign in to manage your HireFlow"}
          </p>
        </div>

        {/* Felmeddelande (DoD krav: Visas snyggt i rött) */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Formulär */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent transition-all"
                placeholder="Your Name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Logga in-knapp */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-950 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors shadow-md disabled:opacity-50 mt-2"
          >
            {loading ? "Authenticating..." : isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Footer: Växla mellan logga in / skapa konto */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
          {isRegister ? "Already have an account?" : "New to HireFlow?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-indigo-600 font-bold hover:underline"
          >
            {isRegister ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
