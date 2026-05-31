import { useState } from "react";
import api from "./../api/axiosInstance";
import JobCard from "../components/JobCard";

const Dashboard = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = true;

  useEffect(() => {
    const fetchHRJobs = async () => {
      try {
        const response = await api.get("api/jobs/my-jobs");
        let jobsArray = [];
        if (response.data && Array.isArray(response.data)) {
          jobsArray = response.data;
        } else if (response.data && Array.isArray(response.data.jobs)) {
          jobsArray = response.data.jobs;
        } else if (response.data && Array.isArray(response.data.data)) {
          jobsArray = response.data.data;
        }
        setJobs(jobsArray);

        if (jobsArray.length > 0) {
          setSelectedJob(jobsArray[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching HE jobs:", error);
        setLoading(false);
      }
    };
    fetchHRJobs();
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100 font-sans">
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

      <section className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="font-bold text-lg tracking-wide">My Jobs</h2>
          <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition-colors shadow">
            + New Job
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          <button className="w-full text-left bg-gray-850 rounded-lg border border-indigo-500 transition-all">
            <h3 className="font-bold text-sm text-white">
              Fullstack Developer
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Stockholm - 5 candidates
            </p>
          </button>
          <button className="w-full text-left p-3 bg-transparent hover:bg-gray-800/50 rounded-lg border border-transparent transition-all">
            <h3 className="font-bold text-sm text-gray-300">
              Frontend React Intern
            </h3>
            <p className="text-xs text-gray-500 mt-1">Remote • 2 Candidates</p>
          </button>
        </div>
      </section>

      <main className="flex-1 bg-gray-950/40 flex flex-col">
        <div className="p-6 border-b berder-gray-800 bg-gray-900/50">
          <h1 className="text-2xl font-extrabold text-white">
            Fullstack Developer
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage pipeline and applicants for this position
          </p>
        </div>
        <div className="w-72 flex-shrink-0 bg-gray-900/80 p-4 rounded-xl border border-gray-800 flex flex-col h-fit max-h-full">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-sm text-gray-300 tracking-wide uppercase">
              New Applied
            </span>
            <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded-md font-bold">
              1
            </span>
          </div>
          <div className="bg-gray-850 p-3 rounded-lg border border-gray-800 shadow-sm hover:border-gray-700 cursor-pointer">
            <h4 className="font-bold text-sm text-white">Manau Tunjae</h4>
            <p className="text-xs text-gray-400 mt-1">manau@example.com</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
