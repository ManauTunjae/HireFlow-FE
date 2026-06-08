import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import JobFormModal from "../components/JobFormModal";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]); // Ny stat: Håller alla HR:s kandidater
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // 1. Hämta ENDAST inloggade HR:s egna jobb och kandidater parallellt
  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const [jobsRes, candidatesRes] = await Promise.all([
          api.get("api/jobs/my-jobs"),
          api.get("api/candidates"), // Hämtar säkra kandidater via din backend-filter! 🔒
        ]);

        // Packa upp jobbannonser
        const jobsArray = Array.isArray(jobsRes.data)
          ? jobsRes.data
          : jobsRes.data?.data || [];
        setJobs(jobsArray);

        // Packa upp kandidater
        const candidatesArray = Array.isArray(candidatesRes.data)
          ? candidatesRes.data
          : candidatesRes.data?.data || [];
        setAllCandidates(candidatesArray);

        // Välj det första jobbet automatiskt om inget är valt än
        if (jobsArray.length > 0 && !selectedJob) {
          setSelectedJob(jobsArray[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching HR dashboard data:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchHRData();
    }
  }, [user]);

  // Hjälpfunktion: Räknar hur många kandidater som sökt ett specifikt jobId
  const getCandidateCountForJob = (jobId) => {
    return allCandidates.filter((cand) => {
      // Hanterar om jobId är ett objekt (.populatat) eller bara en ID-sträng
      const candJobId = cand.jobId?._id || cand.jobId;
      return candJobId === jobId;
    }).length;
  };

  // Hjälpfunktion: Hämtar kandidater för det valda jobbet i ett specifikt status-steg
  const getCandidatesForStage = (jobId, stage) => {
    return allCandidates.filter((cand) => {
      const candJobId = cand.jobId?._id || cand.jobId;
      return (
        candJobId === jobId &&
        cand.status?.toLowerCase() === stage.toLowerCase()
      );
    });
  };

  const handleCreateJob = async (newJobData) => {
    setFormLoading(true);
    setFormError("");
    try {
      const jobDataWithStatus = {
        ...newJobData,
        status: "open",
      };
      const response = await api.post("api/jobs", jobDataWithStatus);
      const createdJob = response.data.data;
      setJobs((prevJobs) => [createdJob, ...prevJobs]);
      setSelectedJob(createdJob);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating job:", error);
      setFormError(
        error.response?.data?.message || "Could not create job. Try again.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      {/* 1. TOP NAV BAR - Mobilanpassad */}
      <nav className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="p-2 bg-emerald-600 rounded-lg text-white font-black text-sm tracking-tight">
            <Link to="/">HireFlow CareerHub</Link>
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

      {/* HUVUDINNEHÅLL */}
      <main className="flex-1 flex flex-col lg:flex-row bg-gray-800 overflow-y-auto lg:overflow-hidden w-full">
        {/* VÄNSTERPANEL: JOBBLISTA */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-800/60 bg-gray-900/10 p-4 flex flex-col shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-400">
                My Jobs
              </h2>
              <p className="text-[10px] text-gray-600 font-medium">
                Manage listings ({jobs.length})
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
            >
              + New Job
            </button>
          </div>

          {loading ? (
            <div className="text-xs text-gray-500 animate-pulse py-4">
              Loading jobs...
            </div>
          ) : (
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto pb-2 lg:pb-0">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all min-w-[240px] lg:min-w-0 ${
                    selectedJob?._id === job._id
                      ? "bg-gray-900 border-indigo-500/50 shadow-lg shadow-black/44"
                      : "bg-gray-900/50 border-gray-800/80 hover:border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-xs text-white truncate">
                      {job.title}
                    </h3>
                    {/* HÄR: Nu räknas antalet kandidater live för detta specifika jobb! 🔥 */}
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-950/50 text-indigo-400 rounded-md shrink-0 border border-indigo-800/30">
                      {getCandidateCountForJob(job._id)} Cand
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
              <div className="border-b border-gray-900 pb-4">
                <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
                  {selectedJob.title}
                </h1>
                <p className="text-[11px] text-gray-500 mt-1">
                  🏢 {selectedJob.company} • 📍 {selectedJob.location}
                </p>
              </div>

              {/* KANBAN STAGES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. APPLIED STAGE */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Applied
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-md text-[9px] font-bold">
                      {getCandidatesForStage(selectedJob._id, "applied").length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {getCandidatesForStage(selectedJob._id, "applied")
                      .length === 0 ? (
                      <div className="bg-gray-900/20 border border-gray-800/60 rounded-xl p-4 text-center border-dashed text-[11px] text-gray-600">
                        No candidates applied yet
                      </div>
                    ) : (
                      getCandidatesForStage(selectedJob._id, "applied").map(
                        (cand) => (
                          <div
                            key={cand._id}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-3 shadow-xs"
                          >
                            <h4 className="font-bold text-xs text-white">
                              {cand.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {cand.email}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              📞 {cand.phone}
                            </p>
                          </div>
                        ),
                      )
                    )}
                  </div>
                </div>

                {/* 2. INTERVIEWING STAGE */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Interviewing
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-md text-[9px] font-bold">
                      {
                        getCandidatesForStage(selectedJob._id, "interview")
                          .length
                      }
                    </span>
                  </div>

                  <div className="space-y-2">
                    {getCandidatesForStage(selectedJob._id, "interview")
                      .length === 0 ? (
                      <div className="bg-gray-900/20 border border-gray-800/60 rounded-xl p-4 text-center border-dashed text-[11px] text-gray-600">
                        No candidates interviewing yet
                      </div>
                    ) : (
                      getCandidatesForStage(selectedJob._id, "interview").map(
                        (cand) => (
                          <div
                            key={cand._id}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-3 shadow-xs"
                          >
                            <h4 className="font-bold text-xs text-white">
                              {cand.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {cand.email}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              📞 {cand.phone}
                            </p>
                          </div>
                        ),
                      )
                    )}
                  </div>
                </div>

                {/* 3. HIRED STAGE */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Hired
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 rounded-md text-[9px] font-bold">
                      {getCandidatesForStage(selectedJob._id, "hired").length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {getCandidatesForStage(selectedJob._id, "hired").length ===
                    0 ? (
                      <div className="bg-white/70 border border-gray-800/60 rounded-xl p-4 text-center border-dashed text-[11px] text-gray-600">
                        No candidates hired yet
                      </div>
                    ) : (
                      getCandidatesForStage(selectedJob._id, "hired").map(
                        (cand) => (
                          <div
                            key={cand._id}
                            className="bg-gray-900 border border-emerald-900/20 rounded-xl p-3 shadow-xs"
                          >
                            <h4 className="font-bold text-xs text-emerald-400">
                              {cand.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {cand.email}
                            </p>
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase mt-2 inline-block">
                              Selected 🎉
                            </span>
                          </div>
                        ),
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8 text-gray-600 text-xs">
              Select a position to review applicants.
            </div>
          )}
        </div>
        <JobFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateJob}
          formLoading={formLoading}
          formError={formError}
        />
      </main>
    </div>
  );
};

export default Dashboard;
