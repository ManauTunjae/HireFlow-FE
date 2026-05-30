import { useState, useEffect } from "react";
import api from "./../api/axiosInstance";
import JobCard from "../components/JobCard";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("api/jobs");
        setJobs(response.data);
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Latest Job Listings
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="rounded-xl boder border-geray-200 shadow-sm">
                <p className="ml-3 text-geay-600 font-medium">
                  Fetching jobs from Render...
                </p>
              </div>
            </div>
          ) : jobs.lenght === 0 ? (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 text-center py-8">
                No jobs available at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-green-60 font-mediun">
                Successfully loaded {filteredJobs.length} job! Card is coming..
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobBoard;
