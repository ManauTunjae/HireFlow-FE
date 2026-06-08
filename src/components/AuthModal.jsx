import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    company: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        const result = await register(
          formData.username,
          formData.email,
          formData.password,
          role,
          formData.company,
        );

        if (result.success) {
          onClose();
          if (role === "candidate") {
            navigate("/candidate-dashboard");
          } else {
            navigate("/recruiter-dashboard");
          }
        } else {
          setError(result.message || "Registration failed. Try again.");
        }
        return;
      }

      const result = await login(formData.email, formData.password);

      if (result.success) {
        onClose();

        const savedUser = JSON.parse(localStorage.getItem("recruiter_user"));

        if (savedUser.role === "candidate") {
          navigate("/");
        } else {
          navigate("/recruiter-dashboard");
        }
      } else {
        setError(result.message || "Invalid credentials!");
      }
    } catch {
      setError("Something wentwrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-40 p-4">
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
        <div className="text-center mb-8">
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h3>
          <p className="text-m text-gray-500 mt-10">
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

        {/* Form */}
        {isRegister && (
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider text-center">
              I want to join as:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200/60 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("candidate")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === "candidate"
                    ? "bg-white text-gray-950 shadow"
                    : "text-gray-500 hover:text-gray-950"
                }`}
              >
                👤 Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === "recruiter"
                    ? "bg-white text-indigo-600 shadow"
                    : "text-gray-500 hover:text-gray-950"
                }`}
              >
                🏢 Recruiter
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          {isRegister && (
            <div>
              <label className="block text-m font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full bg-gray-100/70 border border-gray-200/80 rounded-xl px-4 py-3.5 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                placeholder="Your Name"
              />
            </div>
          )}

          {isRegister && role === "recruiter" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Company Name *
              </label>
              <input
                type="text"
                required={role === "recruiter"} // Krävs bara om man är HR!
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full bg-gray-100/70 border border-gray-200/80 rounded-xl px-4 py-3 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                placeholder="e.g. Acme Corporation"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-gray-100/70 border border-gray-200/80 rounded-xl px-4 py-3 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-gray-100/70 border border-gray-200/80 rounded-xl px-4 py-3 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gray-950 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 mt-4 tracking-wide"
          >
            {loading
              ? "Processing..."
              : isRegister
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        {/* Footer: Växla mellan logga in / skapa konto */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100 text-m text-gray-500">
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
