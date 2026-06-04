import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosInstance";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Hämta HR:s egna jobbannonser från din backend-rutt
  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const [jobsResponse, candidatesResponse] = await Promise.all([
          api.get("api/jobs/my-jobs"),
          api.get("api/candidates/my-applications"),
        ]);

        const jobsArray = Array.isArray(jobsResponse.data)
          ? jobsResponse.data
          : jobsResponse.data?.data || [];
        setJobs(jobsArray);

        const candidatesArray = Array.isArray(candidatesResponse.data)
          ? candidatesResponse.data
          : candidatesResponse.data?.data || [];
        setAllCandidates(candidatesArray);

        // Välj det första jobbet automatiskt om det finns
        if (jobsArray.length > 0 && !selectedJob) {
          setSelectedJob(jobsArray[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching HR data:", error);
        setLoading(false);
      }
    }

    const fetchHRJobs = async () => {
      try {
        const response = await api.get("api/jobs/my-jobs");
        const jobsArray = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        setJobs(jobsArray);

        // Välj det första jobbet automatiskt om det finns
        if (jobsArray.length > 0 && !selectedJob) {
          setSelectedJob(jobsArray[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching HR jobs:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchHRJobs();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col md:flex-row">
      {/* =========================================================
          SLIMMAD SIDOMENY - Mobilvänlig bar högst upp / Stående på dator
         ========================================================= */}
      <aside className="w-full md:w-16 bg-gray-900 border-b md:border-b-0 md:border-r border-gray-800/60 flex flex-row md:flex-col items-center justify-between md:justify-start md:py-6 p-4 gap-6 z-20 shrink-0">
        <div className="flex flex-row md:flex-col items-center gap-6">
          {/* HR Logotyp/Initialer */}
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-sm shadow-md shadow-indigo-600/20">
            {user?.username?.substring(0, 2).toUpperCase() || "HR"}
          </div>
        </div>

        {/* Sign Out - Alltid kvar längst ner/längst ut */}
        <button
          onClick={logout}
          title="Sign out"
          className="text-xs font-bold text-gray-400 hover:text-red-500 transition-all uppercase tracking-wider"
        >
          Log Out 🚪
        </button>
      </aside>

      {/* =========================================================
          HUVUDINNEHÅLL - Stackar kolumnerna vertikalt på mobil
         ========================================================= */}
      <main className="bg-gray-50 flex-1 flex flex-col lg:flex-row overflow-hidden w-full p-2">
        {/* VÄNSTERPANEL: JOBBLISTA & + NEW JOB KNAPP */}
        <div className="w-full rounded-lg lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-800/60 bg-blue-300/20 p-4 md:p-5 flex flex-col shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm text-black font-bold uppercase tracking-wider text-gray-00">
                My Jobs
              </h2>
              <p className="text-[10px] text-gray-600 font-medium">
                Manage listings ({jobs.length})
              </p>
            </div>

            {/* + New Job Knapp (Bevarad och intakt!) ➕ */}
            <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-600/10 transition-all">
              + New Job
            </button>
          </div>

          {loading ? (
            <div className="text-xs text-gray-500 animate-pulse py-4">
              Loading your jobs...
            </div>
          ) : (
            // Scrollbar i sidled på mobil om det behövs, eller stående lista
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto pb-2 lg:pb-0 whitespace-nowrap lg:whitespace-normal">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all min-w-[240px] lg:min-w-0 ${
                    selectedJob?._id === job._id
                      ? "bg-gray-900 border-indigo-500/20 shadow-lg shadow-black/20"
                      : "bg-gray-500/30 border-gray-800/20 hover:border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-xs text-white truncate">
                      {job.title}
                    </h3>
                    {/* HÄR: Räknare för hur många som sökt jobbet! (Kopplas i nästa Trello-kort) */}
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded-md shrink-0 border border-gray-700/50">
                      0 Cand
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">
                    {job.company}
                  </p>
                  <p className="text-[9px] text-gray-600 mt-0.5 truncate">
                    📍 {job.location}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HÖGERPANEL: KANBAN-VY & DETALJER */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          {selectedJob ? (
            <div className="space-y-6">
              {/* Jobb-header */}
              <div className="border-b border-gray-900 pb-4">
                <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
                  {selectedJob.title}
                </h1>
                <p className="text-[11px] text-gray-500 mt-1">
                  🏢 {selectedJob.company} • 📍 {selectedJob.location}
                </p>
              </div>

              {/* KANBAN / KANDIDAT-STAGES */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    New Applied
                  </span>
                  <span className="px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-md text-[9px] font-bold">
                    0
                  </span>
                </div>

                {/* Kandidat-rutan (Här visas VEM som har sökt!) */}
                <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-6 text-center border-dashed">
                  <p className="text-xs text-gray-500 font-medium">
                    No candidates in this stage yet
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">
                    When users apply via CareerHub, they will land here live.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  No job selected
                </p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  Select a position from the left panel to review applicants.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
