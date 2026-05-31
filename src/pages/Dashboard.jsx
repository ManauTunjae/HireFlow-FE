import { useState } from "react";

const Dashboard = () => {
  const [selectedJob, setSelectedJob] = useState(null);

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
      </main>
    </div>
  );
};

export default Dashboard;
