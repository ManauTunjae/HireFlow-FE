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
        
      </section>
    </div>
  );
};

export default Dashboard;
