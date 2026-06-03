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
  }) 

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col">
      {/* HEADER-SEKTION */}
      <header className="p-6 border-b border-gray-900 bg-gray-900/30 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
       
      </header>

      {/* MAIN-CONTENT */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
        </section>
      </main>
    </div>
  );
};

export default CandidateDashboard;
