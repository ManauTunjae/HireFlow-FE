import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CandidateDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
        <span className="text-4xl">Track your job applications</span>
        <h1 className="text-2xl font-black mt-4">Welcome, {user?.name}!</h1>
        <p className="text-gray-400 text-sm mt-1">
          Candidate Account {user?.email}
        </p>
        <div>🚀 Your amazing tracking charts are coming here next!</div>
      </div>
      <button
        onClick={logout}
        className="mt-6 px-6 py-2.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold text-xs rounded-xl transition-all uppercase tracking-wider"
      >
        Sign out
      </button>
    </div>
  );
};

export default CandidateDashboard;
