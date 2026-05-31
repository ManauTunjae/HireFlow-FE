import { useState, useEffect } from "react";
import api from "./../api/axiosInstance";
import JobFormModal from "../components/JobFormModal"; // Importera den nya komponenten!

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Lyft ut fetch-funktionen till glesbygden så att den kan nås överallt i filen!
  const fetchHRJobs = async () => {
    try {
      const response = await api.get("api/jobs/my-jobs"); // Hämtar bara HR-personens egna jobb
      let jobsArray = [];
      if (response.data && Array.isArray(response.data)) {
        jobsArray = response.data;
      } else if (response.data && Array.isArray(response.data.jobs)) {
        jobsArray = response.data.jobs;
      } else if (response.data && Array.isArray(response.data.data)) {
        jobsArray = response.data.data;
      }

      setJobs(jobsArray);
      if (jobsArray.length > 0 && !selectedJob) {
        setSelectedJob(jobsArray[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching HR jobs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("api/jobs");
        console.log("Jobs fetched from Render:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setJobs(response.data);
        } else if (response.data && Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
        } else if (response.data && Array.isArray(response.data.data)) {
          setJobs(response.data.data);
        } else {
          setJobs([]);
        }
        setLoading(false);
      } catch (error) {
        console.log("Error fetching jobs from Render:", error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Hanterar API-anropet när modalen skickar sin formaterade data
  const handleCreateJob = async (jobData) => {
    setFormError("");
    setFormLoading(true);
    try {
      await api.post("api/jobs", jobData); // Skickar med kraven som en [String]-array!
      setIsModalOpen(false); // Stäng modalen
      fetchHRJobs(); // Ladda om listan live!
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Could not create job. Check requirements.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100 font-sans">
      {/* 1. SIDOMENY */}
      <aside className="w-16 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-6 gap-6">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
          HF
        </div>
        <button className="p-2 text-indigo-400 hover:bg-gray-800 rounded-lg transition-colors">
          💼
        </button>
        <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">
          👥
        </button>
        <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">
          ⚙️
        </button>
      </aside>

      {/* 2. MELLAN-MENY */}
      <section className="w-100 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="font-bold text-lg tracking-wide">My Jobs</h2>
          {/* Fixat: onClick med stort C fungerar nu klockrent! */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition-colors shadow"
          >
            + New Job
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-8">
              No jobs created yet.
            </p>
          ) : (
            jobs.map((job) => {
              const isSelected = selectedJob?._id === job._id;
              return (
                <button
                  key={job._id}
                  onClick={() => setSelectedJob(job)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-gray-800 border-indigo-500 shadow-md"
                      : "bg-transparent border-transparent hover:bg-gray-800/40"
                  }`}
                >
                  <h3
                    className={`font-bold text-sm ${isSelected ? "text-white" : "text-gray-300"}`}
                  >
                    {job.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {job.location || "Remote"}
                    </span>
                    <span className="text-[10px] bg-gray-950 px-1.5 py-0.5 rounded-md text-gray-400 font-semibold">
                      0 Cand
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* 3. HUVUDYTA */}
      <main className="flex-1 bg-gray-950/20 flex flex-col">
        {selectedJob ? (
          <>
            <div className="p-6 border-b border-gray-800 bg-gray-900/40">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {selectedJob.title}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                🏢 {selectedJob.company || "Your Company"} • 📍{" "}
                {selectedJob.location || "No location set"}
              </p>
            </div>

            <div className="p-6 flex-1 flex gap-4 overflow-x-auto">
              <div className="w-72 flex-shrink-0 bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex flex-col h-fit max-h-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-xs text-gray-400 tracking-wider uppercase">
                    New Applied
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-gray-950 text-indigo-400 rounded-md font-bold">
                    0
                  </span>
                </div>
                <div className="border-2 border-dashed border-gray-800 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-600">
                    No candidates in this stage
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <p className="text-gray-500 text-lg">No job selected</p>
          </div>
        )}
      </main>

      {/* DEN SEPARATA FORMULÄR-MODALEN */}
      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJob}
        formLoading={formLoading}
        formError={formError}
      />
    </div>
  );
};

export default Dashboard;
