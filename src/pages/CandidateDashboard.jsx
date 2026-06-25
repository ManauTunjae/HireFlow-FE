import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";

const CandidateDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        // 🧼 OPTIMERING: Vi behöver bara hämta ansökningarna om de redan har populatad jobbinfo!
        const response = await api.get("api/candidates/my-applications");

        let allApplications = [];
        if (response.data) {
          if (Array.isArray(response.data)) {
            allApplications = response.data;
          } else if (Array.isArray(response.data.data)) {
            allApplications = response.data.data;
          } else if (Array.isArray(response.data.candidates)) {
            allApplications = response.data.candidates;
          }
        }
        setMyApplications(allApplications);

        // Beräkna statistik live 🎯
        const total = allApplications.length;
        const applied = allApplications.filter(
          (app) => app.status?.toLowerCase() === "applied",
        ).length;
        const interviewing = allApplications.filter(
          (app) =>
            app.status?.toLowerCase() === "interview" ||
            app.status?.toLowerCase() === "interviewing",
        ).length;
        const hired = allApplications.filter(
          (app) => app.status?.toLowerCase() === "hired",
        ).length;
        const rejected = allApplications.filter(
          (app) => app.status?.toLowerCase() === "rejected",
        ).length;

        setStats({ total, applied, interview: interviewing, hired, rejected });
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

  // 🎨 Snygga och proffsiga statusfärger för tabellen
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "interview":
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
      {/* 1. TOP NAV BAR */}
      <nav className="backdrop-blur-md border-b border-gray-200 px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="p-2 bg-emerald-600 rounded-lg text-white font-black text-sm tracking-tight">
            <Link to="/">HireFlow CareerHub</Link>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
          <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full truncate max-w-[160px]">
            👤 {user?.username}
          </span>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold rounded-lg transition-colors"
            >
              ⬅️ Home
            </Link>
            <button
              onClick={() => logout(navigate)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-full transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* 2. DASHBOARD BODY */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-10 space-y-6 md:space-y-8">
        <div>
          <h2 className="text-2xl md:text-2xl font-black text-gray-900 tracking-tight">
            Application Status
          </h2>
          <p className="text-[15px] text-gray-500 mt-1">
            Track your job search progress and insights in real-time analysis.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse text-sm font-medium">
            Analyzing database records...
          </div>
        ) : (
          <>
            {/* 3. REALTIDS STATISTIKKORT */}
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {" "}
              {/* 🎯 Ändrat till 5 kolumner så alla kort får plats på en rad! */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[13px] md:text-sm font-bold uppercase tracking-wider">
                    Total Apps
                  </span>
                  <span className="text-emerald-500 bg-emerald-50 p-1 rounded-md text-xs">
                    📊
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                  {stats.total}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[13px] md:text-xs font-bold uppercase tracking-wider">
                    Applied
                  </span>
                  <span className="text-amber-500 bg-amber-50 p-1 rounded-md text-xs">
                    ⏳
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                  {stats.applied}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[13px] md:text-xs font-bold uppercase tracking-wider">
                    Interview
                  </span>
                  <span className="text-indigo-500 bg-indigo-50 p-1 rounded-md text-xs">
                    📈
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                  {stats.interview}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[13px] md:text-xs font-bold uppercase tracking-wider">
                    Hired
                  </span>
                  <span className="text-emerald-500 bg-emerald-50 p-1 rounded-md text-xs">
                    ✅
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-emerald-600 mt-2">
                  {stats.hired}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[13px] md:text-xs font-bold uppercase tracking-wider">
                    Rejected
                  </span>
                  <span className="text-red-500 bg-red-50 p-1 rounded-md text-xs">
                    ❌
                  </span>
                </div>
                {/* 🎯 FIXAT: Nu visas stats.rejected korrekt här! 👇 */}
                <div className="text-2xl md:text-3xl font-black text-red-600 mt-2">
                  {stats.rejected}
                </div>
              </div>
            </section>

            {/* 4. VISUELL GRAFIK */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between min-h-[260px]">
                <div>
                  <h3 className="font-bold text-md text-gray-900">
                    Application Status
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Distribution of current job stages
                  </p>
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-3.5 mt-4">
                  {/* Progress bars */}
                  {[
                    {
                      label: "Applied ⏳",
                      value: stats.applied,
                      color: "bg-amber-500",
                    },
                    {
                      label: "Interviewing 📈",
                      value: stats.interview,
                      color: "bg-indigo-500",
                    },
                    {
                      label: "Hired ✅",
                      value: stats.hired,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Rejected ❌",
                      value: stats.rejected,
                      color: "bg-red-500",
                    },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-md font-semibold text-gray-600 mb-1">
                        <span>{item.label}</span>
                        <span>
                          {stats.total > 0
                            ? Math.round((item.value / stats.total) * 100)
                            : 0}
                          % ({item.value})
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{
                            width: `${stats.total > 0 ? (item.value / stats.total) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Tracking chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-xs flex flex-col justify-between min-h-[260px]">
                <div>
                  <h3 className="font-bold text-md text-gray-900">
                    Applications Over Time
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Monthly tracking insights
                  </p>
                </div>

                {(() => {
                  const now = new Date();
                  const months = [-2, -1, 0].map((offset) => {
                    const d = new Date(
                      now.getFullYear(),
                      now.getMonth() + offset,
                      1,
                    );
                    return {
                      label: d.toLocaleString("en", { month: "short" }),
                      year: d.getFullYear(),
                      month: d.getMonth(),
                    };
                  });

                  const countPerMonth = months.map(
                    ({ month, year }) =>
                      myApplications.filter((app) => {
                        const created = new Date(app.createdAt);
                        return (
                          created.getMonth() === month &&
                          created.getFullYear() === year
                        );
                      }).length,
                  );

                  const maxCount = Math.max(...countPerMonth, 1);
                  const MAX_BAR_HEIGHT = 95;

                  return (
                    <div className="flex-1 flex items-end justify-around h-32 border-b border-gray-200 mt-4 pb-1">
                      {months.map((m, i) => {
                        const count = countPerMonth[i];
                        const isCurrentMonth = i === 2;
                        const barHeight = Math.max(
                          (count / maxCount) * MAX_BAR_HEIGHT,
                          4,
                        );

                        return (
                          <div
                            key={m.label}
                            className="flex flex-col items-center gap-1 w-10 group relative"
                          >
                            <span className="absolute -top-6 text-[15px] font-bold bg-gray-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {count} apps
                            </span>
                            <div
                              className={`w-full rounded-t-sm transition-all duration-500 ${
                                isCurrentMonth
                                  ? "bg-emerald-500 shadow-xs"
                                  : "bg-gray-200"
                              }`}
                              style={{ height: `${barHeight}px` }}
                            />
                            <span
                              className={`text-[9px] font-bold ${isCurrentMonth ? "text-emerald-600" : "text-gray-400"}`}
                            >
                              {m.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </section>

            {/* 5. APPLICATION HISTORY */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-md text-gray-900">
                  Application History
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  Review and track the progress of your submitted resumes
                </p>
              </div>

              {myApplications.length === 0 ? (
                <div className="p-10 text-center text-sm text-gray-400">
                  📂 You haven't applied for any jobs yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
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
                        // 🎯 OPTIMERING: Läser direkt från ditt populatade jobId-objekt!
                        const job =
                          (typeof app.jobId === "object"
                            ? app.jobId
                            : app.job) || {};
                        return (
                          <tr
                            key={app._id}
                            className="hover:bg-gray-50/30 transition-colors"
                          >
                            <td className="p-4 pl-5 font-bold text-gray-900">
                              {job.title || "Unknown Position"}
                            </td>
                            <td className="p-4 text-gray-500">
                              {job.company || "Pending Details"}
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                                📍 {job.location?.split(",")[0] || "Remote"}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${getStatusStyle(app.status)}`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="p-4 pr-5 text-right text-gray-400">
                              {app.createdAt
                                ? new Date(app.createdAt).toLocaleDateString(
                                    "sv-SE",
                                  )
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
