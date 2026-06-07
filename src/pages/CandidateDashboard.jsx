import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosInstance";

const CandidateDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [myApplications, setMyApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    hired: 0,
  });

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        // Hämta data från dina endpoints parallellt
        const [applicationsRes, jobsRes] = await Promise.all([
          api.get("api/candidates/my-applications"),
          api.get("api/jobs"),
        ]);

        // Felsäker uppackning av jobbannonser
        let allJobs = [];
        if (jobsRes.data) {
          if (Array.isArray(jobsRes.data)) {
            allJobs = jobsRes.data;
          } else if (Array.isArray(jobsRes.data.data)) {
            allJobs = jobsRes.data.data;
          }
        }
        setJobs(allJobs);

        // Felsäker uppackning av dina nya testansökningar
        let allApplications = [];
        if (applicationsRes.data) {
          if (Array.isArray(applicationsRes.data)) {
            allApplications = applicationsRes.data;
          } else if (Array.isArray(applicationsRes.data.data)) {
            allApplications = applicationsRes.data.data;
          } else if (Array.isArray(applicationsRes.data.candidates)) {
            allApplications = applicationsRes.data.candidates;
          }
        }
        setMyApplications(allApplications);

        // Beräkna realtidsstatistik – Synkat exakt med dina Mongoose Enums! 🎯
        const total = allApplications.length;
        const applied = allApplications.filter(
          (app) => app.status?.toLowerCase() === "applied"
        ).length;
        const interviewing = allApplications.filter(
          (app) => app.status?.toLowerCase() === "interview"
        ).length;
        const hired = allApplications.filter(
          (app) => app.status?.toLowerCase() === "hired"
        ).length;

        // Här mappar vi nycklarna exakt mot dina stats!
        setStats({ total, applied, interview: interviewing, hired });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching candidate dashboard data:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchCandidateData();
    }
  }, [user]);

  // Hjälpfunktion: Letar upp rätt jobbdetaljer baserat på jobbId i ansökan
  const getJobDetails = (jobId) => {
    const foundJob = jobs.find((j) => j._id === jobId);
    return (
      foundJob || {
        title: "Unknown Position",
        company: "Company details pending",
        location: "Remote",
      }
    );
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "interviewing":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "hired":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      {/* 1. TOP NAV BAR - Mobilanpassad */}
      <nav className="backdrop-blur-md border-b border-gray-200 px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="p-2 bg-emerald-600 rounded-lg text-white font-black text-sm tracking-tight">
            HireFlow CareerHub
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-800 sm:gap-4">
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full truncate max-w-[160px]">
            👤 {user?.username}
          </span>
          <button
            onClick={logout}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg ml-4 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* 2. DASHBOARD BODY */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-10 space-y-6 md:space-y-8">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            Analytics
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Track your job search progress and insights in real-time.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse text-sm font-medium">
            Analyzing database records...
          </div>
        ) : (
          <>
            {/* 3. REALTIDS STATISTIKKORT - 2 kolumner på mobil, 4 på dator */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider truncate">
                    Total Apps
                  </span>
                  <span className="text-emerald-500 bg-emerald-50 p-1 md:p-1.5 rounded-md text-xs">📊</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-gray-900 mt-2 md:mt-4">
                  {stats.total}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider truncate">
                    Interview
                  </span>
                  <span className="text-indigo-500 bg-indigo-50 p-1 md:p-1.5 rounded-md text-xs">📈</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-gray-900 mt-2 md:mt-4">
                  {stats.interview}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider truncate">
                    Applied
                  </span>
                  <span className="text-amber-500 bg-amber-50 p-1 md:p-1.5 rounded-md text-xs">⏳</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-gray-900 mt-2 md:mt-4">
                  {stats.applied}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider truncate">
                    Hired
                  </span>
                  <span className="text-emerald-500 bg-emerald-50 p-1 md:p-1.5 rounded-md text-xs">✅</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-emerald-600 mt-2 md:mt-4">
                  {stats.hired}
                </div>
              </div>
            </section>

            {/* 4. VISUELL GRAFIK - Stackas vertikalt på mobil */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between min-h-[260px]">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Application Status
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Distribution of current job stages
                  </p>
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-3.5 mt-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                      <span>Applied ⏳</span>
                      <span>
                        {stats.total > 0 ? Math.round((stats.applied / stats.total) * 100) : 0}% ({stats.applied})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.applied / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                      <span>Interviewing 📈</span>
                      <span>
                        {stats.total > 0 ? Math.round((stats.interview / stats.total) * 100) : 0}% ({stats.interview})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.interview / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                      <span>Hired ✅</span>
                      <span>
                        {stats.total > 0 ? Math.round((stats.hired / stats.total) * 100) : 0}% ({stats.hired})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.hired / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between min-h-[260px]">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Applications Over Time
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Monthly tracking insights
                  </p>
                </div>
                <div className="flex-1 flex items-end justify-around h-32 border-b border-gray-200 mt-4 relative pb-1">
                  <div className="absolute left-0 right-0 bottom-10 border-t border-gray-100/70 pointer-events-none"></div>
                  <div className="absolute left-0 right-0 bottom-20 border-t border-gray-100/70 pointer-events-none"></div>
                  <div className="flex flex-col items-center gap-1 w-10 z-10">
                    <div className="w-full bg-gray-200 rounded-t-sm" style={{ height: "15px" }}></div>
                    <span className="text-[9px] font-bold text-gray-400">May</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 w-10 z-10">
                    <div className="w-full bg-emerald-500 rounded-t-sm shadow-xs" style={{ height: `${Math.min(stats.total * 25, 95)}px` }}></div>
                    <span className="text-[9px] font-bold text-emerald-600">June</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 w-10 z-10">
                    <div className="w-full bg-gray-100 rounded-t-sm" style={{ height: "4px" }}></div>
                    <span className="text-[9px] font-bold text-gray-300">Jul</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. APPLICATION HISTORY - Horisontell scroll-skydd för mobiler */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900">
                  Application History
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Review and track the progress of your submitted resumes
                </p>
              </div>

              {myApplications.length === 0 ? (
                <div className="p-10 text-center text-xs text-gray-400">
                  📂 You haven't applied for any jobs yet. Get out there and apply!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-50/70 text-gray-400 border-b border-gray-100 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4 pl-5">Job Title</th>
                        <th className="p-4">Company</th>
                        <th className="p-4">Location</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 pr-5 text-right">Applied Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {myApplications.map((app) => {
                        const job = getJobDetails(app.jobId);
                        return (
                          <tr key={app._id} className="hover:bg-gray-50/30 transition-colors">
                            <td className="p-4 pl-5 font-bold text-gray-900">
                              {job.title}
                            </td>
                            <td className="p-4 text-gray-500">{job.company}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                                📍 {job.location?.split(",")[0] /* Förkortar adresser på mobilen */}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${getStatusStyle(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="p-4 pr-5 text-right text-gray-400">
                              {app.createdAt
                                ? new Date(app.createdAt).toLocaleDateString("sv-SE")
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default CandidateDashboard;