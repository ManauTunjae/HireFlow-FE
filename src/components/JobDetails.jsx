import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
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
    const fetchJobDetails = async () => {
      try {
        const response = await api.get(`api/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error("Could not fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const uploadData = new FormData();

      uploadData.append("jobId", job._id);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          Loading job details...
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-gray-600 font-bold">Job not found 🔍</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-950 text-white rounded-lg text-sm font-semibold"
        >
          Back to Job Board
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        {/* Tillbaka-knapp */}
        <button
          onClick={() => navigate("/")}
          className="text-md font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6 flex items-center gap-1 cursor-pointer"
        >
          ⬅️ Back to all jobs
        </button>

        {/* Header */}
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {job.title}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 font-medium mt-2">
            <span>🏢 {job.company}</span>
            <span>📍 {job.location}</span>
            {job.salary && (
              <span className="text-emerald-600 font-semibold">
                {job.salary}
              </span>
            )}
          </div>
        </div>

        {/* Beskrivning */}
        <div className="py-6 border-b border-gray-100">
          <h2 className="text-[1rem] font-bold uppercase tracking-wider text-gray-400 mb-3">
            About the role
          </h2>
          <p className="text-gray-700 text-md leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Action-del (Apply) */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[1rem] font-bold uppercase text-gray-400">
              Status
            </p>
            <p
              className={`text-md font-bold ${job.status === "closed" ? "text-red-500" : "text-green-600"}`}
            >
              {job.status === "closed"
                ? "Closed"
                : "Open & Accepting Applications"}
            </p>
          </div>

          {/* 🎯 AKTIVERAD KNAPP: Öppnar nu modalen live! */}
          <button
            disabled={job.status === "closed"}
            onClick={() => setIsApplyModalOpen(true)}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all text-center ${
              job.status === "closed"
                ? "bg-red-50 text-red-500 border border-red-200 cursor-not-allowed"
                : "bg-gray-950 text-white hover:bg-gray-800 cursor-pointer shadow-md shadow-black/5"
            }`}
          >
            {job.status === "closed" ? "Closed" : "Apply for this job"}
          </button>
        </div>
      </div>

      {/* 🎯 HITFLYTTAD MODAL: Renderas snyggt inifrån detaljsidan */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-[1.5rem] font-black text-gray-900 tracking-tight">
                  Apply for {job.title}
                </h3>
                <p className="text-md text-gray-500">
                  🏢 {job.company} • 📍 {job.location}
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
    </div>
  );
};

export default JobDetails;