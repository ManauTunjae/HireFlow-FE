import { useState, useEffect } from "react";
import api from "./../api/axiosInstance";
import JobCard from "../components/JobCard";
import AuthModal from "../components/AuthModal"

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Find your tech-job
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Explore the latest tech job opportunities and connect with top
            companies. Your dream job is just a click away!
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px--4 py-12">
        {/* search job */}
        <div className="mb-10">
          <div className="max-w-md">
            <label
              htmlFor="search"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Search oppotunities
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by title, company or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Job list */}
        <div className="text-2xl font-bold mb-6 text-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {searchQuery ? "Search Results" : "Latest Jobs Listings"}
          </h2>
        </div>

        <div className="mb-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600 font-medium">
                Fetching jobs from Render...
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-gray-500 py-4">
                {searchQuery
                  ? "No jobs match your search."
                  : "No jobs available at the moment."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobBoard;
