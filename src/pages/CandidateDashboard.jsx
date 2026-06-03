import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosInstance";

const CandidateDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    interviews: 0,
    pending: 0,
    accepted: 0
  });

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const response = await api.get("api/candidates")

        const allData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        
          const candidateEmail = user?.email?.toLowerCase();
          const filteredApplications = allData.filter(
            (app) => app.email?.toLowerCase() === candidateEmail
          )
          setMyApplications(filteredApplications);
           
          const total = filteredApplications.length;
          const interview = filteredApplications.filter(app => app.status?.toLowerCase() === "interview").length;
          const pending = filteredApplications.filter(app => app.status?.toLowerCase() === "pending").length;
          const accepted = filteredApplications.filter(app => app.status?.toLowerCase() === "accepted").length;

          setStats({ total, interviews: interview, pending, accepted });
          setLoading(false);
      } catch (error) {
        console.error("Error fetching candidate data:", error);
        setLoading(false);
      }
    }
    if (user) {
      fetchCandidateData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      {/* HEADER-SEKTION */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-xs">
       <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 rounded-lg text-white font-black text-sm tracking-tight">
            💼 CareerHub
          </div>
        </div>
        {/* Center länkar */}
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <button className="hover:text-gray-900 transition-colors">Browse Jobs</button>
          <button className="hover:text-gray-900 transition-colors">My Applications</button>
          <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-bold">Analytics</button>
        </div>
        {/* Höger profil / Logga ut */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            👤 {user?.username}
          </span>
          <button 
            onClick={logout}
            title="Sign out"
            className="text-xs font-bold text-gray-400 hover:text-red-500 transition-all uppercase tracking-wider"
          >
            Log Out 🚪
          </button>
        </div>
      </nav>

      {/* MAIN-CONTENT */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
        </section>
      </main>
    </div>
  );
};

export default CandidateDashboard;
