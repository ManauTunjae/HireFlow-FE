import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import JobFormModal from "../components/JobFormModal";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]); // Ny stat: Håller alla HR:s kandidater
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingJob, setEditingJob] = useState(null);

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

  // 🎯 STEG 3: Smart kombinations-funktion för att både skapa och redigera jobb live!
  const handleCreateOrUpdateJob = async (jobData) => {
    setFormLoading(true);
    setFormError("");
    try {
      if (editingJob) {
        // 🔄 REDIGERA BEFINTLIGT JOBB (PUT /api/jobs/:id)
        const response = await api.put(`api/jobs/${editingJob._id}`, jobData);

        // Packa upp det uppdaterade jobbet från din backends response
        const updatedJob = response.data.data;

        // Uppdatera din lokala jobblista (state) live på skärmen direkt! 😍
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === updatedJob._id ? updatedJob : job,
          ),
        );

        // Om det här jobbet är det som är aktivt i Kanban-vyn just nu, uppdatera det med!
        if (selectedJob?._id === updatedJob._id) {
          setSelectedJob(updatedJob);
        }

        // Återställ edit-state efter lyckad sparning
        setEditingJob(null);
        alert("Job listing updated successfully! 🎉");
      } else {
        // 🆕 SKAPA NYTT JOBB (POST /api/jobs) - Din gamla fungerande kod
        const jobDataWithStatus = {
          ...jobData,
          status: "open",
        };
        const response = await api.post("api/jobs", jobDataWithStatus);
        const createdJob = response.data.data;

        setJobs((prevJobs) => [createdJob, ...prevJobs]);
        setSelectedJob(createdJob);
        alert("Your job has been created successfully! 💼");
      }

      // Stäng modalen oavsett om vi skapade eller redigerade
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving job:", error);
      setFormError(
        error.response?.data?.message ||
          "Could not save job. Please try again.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateCandidateStatus = async (candidateId, newStatus) => {
    try {
      await api.patch(`api/candidates/${candidateId}`, { status: newStatus });
      setAllCandidates((prevCandidates) =>
        prevCandidates.map((cand) =>
          cand._id === candidateId ? { ...cand, status: newStatus } : cand,
        ),
      );
    } catch (error) {
      console.error("Error updating candidate status:", error);
      alert("Failed to update candidate status. Please try again.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      `Are you sure to remove ${selectedJob.title}`,
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`api/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      if (selectedJob?._id === jobId) {
        setSelectedJob(null);
      }
      alert("The selected job has been removed!");
    } catch (error) {
      console.error("Error removing job:", error);
      alert(
        error.response?.data?.message || "Could not remove a job. Try again!",
      );
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
          <span className="text-base font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full truncate max-w-[160px]">
            👤 {user?.username}
          </span>
          <button
            onClick={() => logout(navigate)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-full ml-4 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* HUVUDINNEHÅLL */}
      <main className="flex-1 flex flex-col lg:flex-row bg-gray-800 overflow-y-auto lg:overflow-hidden w-full">
        {/* VÄNSTERPANEL: JOBBLISTA */}
        <div className="w-full lg:w-100 border-b lg:border-b-0 lg:border-r border-gray-800/60 bg-gray-900/10 p-4 flex flex-col shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-400">
                My Jobs
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                Manage listings ({jobs.length})
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-all"
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
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all min-w-[300px] lg:min-w-0 group ${
                    selectedJob?._id === job._id
                      ? "bg-gray-900 border-indigo-500/50 shadow-lg shadow-black/44"
                      : "bg-gray-900/50 border-gray-800/80 hover:border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 w-full">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <h3 className="font-bold text-base text-white truncate">
                        {job.title}
                      </h3>
                      <span
                        className={`text-[13px] font-black uppercase px-2 py-0.5 rounded-full border tracking-wide shrink-0 ${
                          job.status === "open"
                            ? "bg-green-950 text-green-400 border-green-900/30"
                            : job.status === "draft"
                              ? "bg-amber-950 text-amber-500 border-amber-900/30"
                              : "bg-red-950 text-red-400 border-red-800/30"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <span className="text-[13px] font-bold px-1.5 py-0.5 bg-indigo-950/50 text-indigo-400 rounded-md shrink-0 border border-indigo-800/30">
                      {getCandidateCountForJob(job._id)} Cand
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 mt-1 truncate">
                    {job.company}
                  </p>
                  <p className="text-[13px] text-gray-600 mt-0.5 truncate">
                    📍 {job.location}
                  </p>
                  <div className="mt-4 flex items-center gap-2 h-8">
                    {selectedJob?._id === job._id && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingJob(job);
                            setIsModalOpen(true);
                          }}
                          className="text-sm uppercase font-bold rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-yellow-300 hover:bg-yellow-500 hover:text-black transition-all duration-200"
                          title="Edit Job"
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteJob(job._id);
                          }}
                          className="text-sm uppercase font-bold rounded-md border border-red-900/50 bg-red-950/40 px-2 py-1 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200"
                          title="Delete Job"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KANBAN-VY & DETALJER */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          {selectedJob ? (
            <div className="space-y-6">
              <div className="border-b border-gray-900 pb-4 flex justify-between items-start gap-3 w-full">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {selectedJob.title}
                  </h1>
                  <p className="text-[15px] text-gray-500 mt-1">
                    🏢 {selectedJob.company} • 📍 {selectedJob.location}
                  </p>
                </div>
                <span
                  className={`text-[15px] font-black uppercase px-2 py-0.5 rounded-full border tracking-wide shrink-0 ${
                    selectedJob.status === "open"
                      ? "bg-green-950 text-green-400 border-green-900/30"
                      : selectedJob.status === "draft"
                        ? "bg-amber-950 text-amber-500 border-amber-900/30" // 🟡 Snygg mörk gul-orange (amber)
                        : "bg-red-950 text-red-400 border-red-800/30"
                  }`}
                >
                  {selectedJob.status || "open"}
                </span>
              </div>

              {/* KANBAN STAGES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. APPLIED STAGE */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-md font-bold uppercase tracking-wider text-gray-400">
                      Applied
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-md text-[10px] font-bold">
                      {getCandidatesForStage(selectedJob._id, "applied").length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {getCandidatesForStage(selectedJob._id, "applied")
                      .length === 0 ? (
                      <div className="bg-gray-900/20 border border-gray-800/60 rounded-xl p-4 text-center border-dashed text-sm text-gray-400">
                        No candidates applied yet
                      </div>
                    ) : (
                      getCandidatesForStage(selectedJob._id, "applied").map(
                        (cand) => (
                          <div
                            key={cand._id}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-3 shadow-xs space-y-2.5"
                          >
                            <div>
                              <h4 className="font-bold text-md text-white">
                                {cand.name}
                              </h4>
                              <p className="text-sm text-gray-400 mt-0.5">
                                {cand.email}
                              </p>
                              <p className="text-sm text-gray-400 mt-0.5">
                                📞 {cand.phone}
                              </p>
                            </div>

                            {/* 📄 CLOUDINARY DOKUMENT */}
                            <div className="bg-gray-950/40 p-2 rounded-lg border border-gray-800/60 space-y-1">
                              <span className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                                Documents
                              </span>
                              {cand.resume ? (
                                <a
                                  href={cand.resume}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                  📄 View Resume (CV)
                                </a>
                              ) : (
                                <span className="text-[11px] text-red-400/70 block">
                                  ⚠️ Missing CV
                                </span>
                              )}

                              {cand.coverLetter && (
                                <a
                                  href={cand.coverLetter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors pt-0.5"
                                >
                                  ✉️ Cover Letter
                                </a>
                              )}
                            </div>

                            <div className="border-t border-gray-800/60 pt-2">
                              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                                Change Stage
                              </label>
                              <select
                                value={cand.status?.toLowerCase()}
                                onChange={(e) =>
                                  handleUpdateCandidateStatus(
                                    cand._id,
                                    e.target.value,
                                  )
                                }
                                className="w-auto bg-gray-950 border border-gray-800 rounded-md px-1 py-1 text-[13px] font-bold text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                              >
                                <option value="applied">📋 Applied</option>
                                <option value="interviewing">
                                  🤝 Interviewing
                                </option>
                                <option value="hired">🎉 Hired</option>
                                <option value="rejected">❌ Rejected</option>
                              </select>
                            </div>
                          </div>
                        ),
                      )
                    )}
                  </div>
                </div>

                {/* 2. INTERVIEWING STAGE */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-md font-bold uppercase tracking-wider text-gray-400">
                      Interviewing
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-md text-[10px] font-bold">
                      {
                        getCandidatesForStage(selectedJob._id, "interviewing")
                          .length
                      }
                    </span>
                  </div>

                  <div className="space-y-2">
                    {getCandidatesForStage(selectedJob._id, "interviewing")
                      .length === 0 ? (
                      <div className="bg-gray-900/20 border border-gray-800/60 rounded-xl p-4 text-center border-dashed text-sm text-gray-400">
                        No candidates interviewing yet
                      </div>
                    ) : (
                      getCandidatesForStage(
                        selectedJob._id,
                        "interviewing",
                      ).map((cand) => (
                        <div
                          key={cand._id}
                          className="bg-gray-900 border border-gray-800 rounded-xl p-3 shadow-xs space-y-2.5"
                        >
                          <div>
                            <h4 className="font-bold text-md text-white">
                              {cand.name}
                            </h4>
                            <p className="text-sm text-gray-400 mt-0.5">
                              {cand.email}
                            </p>
                            <p className="text-sm text-gray-400 mt-0.5">
                              📞 {cand.phone}
                            </p>
                          </div>

                          {/* 📄 CLOUDINARY DOKUMENT */}
                          <div className="bg-gray-950/40 p-2 rounded-lg border border-gray-800/60 space-y-1">
                            <span className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                              Documents
                            </span>
                            {cand.resume ? (
                              <a
                                href={`/api/candidates/${cand._id}/download/resume`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center gap-1.5 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                              >
                                📄 View Resume (CV)
                              </a>
                            ) : (
                              <span className="text-[11px] text-red-400/70 block">
                                ⚠️ Missing CV
                              </span>
                            )}

                            {cand.coverLetter && (
                              <a
                                href={`/api/candidates/${cand._id}/download/coverLetter`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center gap-1.5 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors pt-0.5"
                              >
                                ✉️ Cover Letter
                              </a>
                            )}
                          </div>

                          <div className="border-t border-gray-800/60 pt-2">
                            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
                              Change Stage
                            </label>
                            <select
                              value={cand.status?.toLowerCase()}
                              onChange={(e) =>
                                handleUpdateCandidateStatus(
                                  cand._id,
                                  e.target.value,
                                )
                              }
                              className="w-auto bg-gray-950 border border-gray-800 rounded-md px-1 py-1 text-[13px] font-bold text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                            >
                              <option value="applied">📋 Applied</option>
                              <option value="interviewing">
                                🤝 Interviewing
                              </option>
                              <option value="hired">🎉 Hired</option>
                              <option value="rejected">❌ Rejected</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. HIRED STAGE */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-md font-bold uppercase tracking-wider text-emerald-400">
                      Hired
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-950/30 border border-emerald-900/30 text-white rounded-md text-[10px] font-bold">
                      {getCandidatesForStage(selectedJob._id, "hired").length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {getCandidatesForStage(selectedJob._id, "hired").length ===
                    0 ? (
                      <div className="bg-white/70 border border-gray-800/60 rounded-xl p-4 text-center border-dashed text-[11px] text-white">
                        No candidates hired yet
                      </div>
                    ) : (
                      getCandidatesForStage(selectedJob._id, "hired").map(
                        (cand) => (
                          <div
                            key={cand._id}
                            className="bg-green-900/70 border border-emerald-900/20 rounded-xl p-3 shadow-xs"
                          >
                            <h4 className="font-bold text-sm text-white">
                              {cand.name}
                            </h4>
                            <p className="text-sm text-gray-200 mt-0.5">
                              {cand.email}
                            </p>
                            <span className="text-sm bg-white text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase mt-2 inline-block">
                              Selected 🎉
                            </span>
                          </div>
                        ),
                      )
                    )}
                  </div>
                </div>

                {/* 4. REJECTED STAGE */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-md font-bold uppercase tracking-wider text-red-600">
                      Rejected
                    </span>
                    <span className="px-1.5 py-0.5 bg-red-950 border border-red-900 text-white rounded-md text-[10px] font-bold">
                      {
                        getCandidatesForStage(selectedJob._id, "rejected")
                          .length
                      }
                    </span>
                  </div>

                  <div className="space-y-2">
                    {getCandidatesForStage(selectedJob._id, "rejected")
                      .length === 0 ? (
                      <div className="bg-white/70 border border-gray-800/60 rounded-xl p-4 text-center border-dashed text-[11px] text-white">
                        No candidates rejected yet
                      </div>
                    ) : (
                      getCandidatesForStage(selectedJob._id, "rejected").map(
                        (cand) => (
                          <div
                            key={cand._id}
                            className="bg-red-900/50 border border-red-900 rounded-xl p-3 shadow-xs"
                          >
                            <h4 className="font-bold text-sm text-white">
                              {cand.name}
                            </h4>
                            <p className="text-sm text-white mt-0.5">
                              {cand.email}
                            </p>
                            <span className="text-sm bg-white text-red-600 px-1.5 py-0.5 rounded font-bold uppercase mt-2 inline-block">
                              rejected ❌
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
          onClose={() => {
            setIsModalOpen(false);
            setEditingJob(null);
          }}
          onSubmit={handleCreateOrUpdateJob}
          formLoading={formLoading}
          formError={formError}
          editingJob={editingJob}
        />
      </main>
    </div>
  );
};

export default Dashboard;
