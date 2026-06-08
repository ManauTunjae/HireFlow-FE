import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../api/axiosInstance";
import JobCard from "../components/JobCard";
import AuthModal from "../components/AuthModal";
import { AuthContext } from "../context/AuthContext";

const JobBoard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedIn: "",
    github: "",
  });
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

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

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const uploadData = new FormData();

      uploadData.append("jobId", applyingJob._id);
      uploadData.append("name", formData.name);
      uploadData.append("email", formData.email);
      uploadData.append("phone", formData.phone);

      if (formData.linkedIn) uploadData.append("LinkedIn", formData.linkedIn);
      if (formData.github) uploadData.append("Github", formData.github);

      if (resume) uploadData.append("resume", resume);
      if (coverLetter) uploadData.append("coverLetter", coverLetter);

      const response = await api.post("api/candidates", uploadData);
      console.log("Application submitted successfully:", response.data);

      alert("Your application has been submitted successfully! 🎉");
      setIsApplyModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        linkedIn: "",
        github: "",
      });
      setResume(null);
      setCoverLetter(null);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(
        error.response?.data?.message || "Something went wrong when applying.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-green-50 text-gray-900">
      {/* Login */}
      <nav className="sticky top-0 bg-green-900/70 backdrop-blur-md border-b border-gray-200 px-6 py-4 z-40">
        <div className="max-w-auto mx-auto flex justify-between items-center">
          <span className="text-2xl font-black text-gray-950 tracking-tighter">
            Hire<span className="text-white">Flow</span>
          </span>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => {
                    if (user.role === "candidate") {
                      navigate("/candidate-dashboard");
                    } else {
                      navigate("/recruiter-dashboard");
                    }
                  }}
                  className="px-4 py-2 text-sm font-bold text-white bg-green-800 hover:bg-white hover:text-green-900 rounded-xl transition-all"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => logout(navigate)}
                  className="px-4 py-2 text-sm font-bold text-white bg-red-800 hover:bg-white hover:text-red-700/80 rounded-xl transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 text-sm font-bold text-gray-900 bg-white hover:bg-green-800 hover:text-white rounded-xl transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <header className="bg-white border-b border-gray-200 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Find your tech-job
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto p-4">
            Explore the latest tech job opportunities and connect with top
            companies. Your dream job is just a click away!
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-12">
        <div className="mb-10">
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />

          {isApplyModalOpen && applyingJob && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">
                      Apply for {applyingJob.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      🏢 {applyingJob.company} • 📍 {applyingJob.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form
                  className="space-y-4 text-xs font-semibold text-gray-700"
                  onSubmit={handleApplySubmit}
                >
                  <div>
                    <label className="block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="070-123 45 67"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                    <div>
                      <label className="block mb-1 text-gray-500">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={formData.linkedIn}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedIn: e.target.value })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-500">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={formData.github}
                        onChange={(e) =>
                          setFormData({ ...formData, github: e.target.value })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                    <div>
                      <label className="block mb-1 text-emerald-700">
                        Upload CV / Resume *
                      </label>
                      <input
                        type="file"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResume(e.target.files[0])}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer transition-all"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-indigo-700">
                        Upload Cover Letter
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCoverLetter(e.target.files[0])}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsApplyModalOpen(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-md shadow-emerald-600/10 transition-all flex items-center gap-2"
                    >
                      {submitLoading
                        ? "Uploading application... ⏳"
                        : "Submit Application 💼"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="max-w-md mx-auto text-md">
            <label
              htmlFor="search"
              className="block text-md font-semibold text-gray-700 mb-2"
            >
              Search opportunities
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by title, company or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all"
            />
          </div>
        </div>

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
                <JobCard
                  key={job._id || job.id}
                  job={job}
                  onApply={() => {
                    setApplyingJob(job);
                    setIsApplyModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobBoard;
