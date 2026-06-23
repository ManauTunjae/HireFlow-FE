import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [Loading, setLoading] = useState(true);
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

  if (Loading) {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        {/* Tillbaka-knapp */}
        <button
          onClick={() => navigate("/")}
          className="text-[1rem] font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6 flex items-center gap-1 cursor-pointer"
        >
          ⬅️ Back to all jobs
        </button>

        {/* Header */}
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {job.title}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-md text-gray-500 font-medium mt-2">
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
          <h2 className="text-md font-bold uppercase tracking-wider text-gray-400 mb-3">
            About the role
          </h2>
          <p className="text-gray-700 text-[1.1rem] leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Kravlista (Requirements) 📝 */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="py-6 border-b border-gray-100">
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-400 mb-3">
              Requirements
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {job.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200/60 px-3 py-2 rounded-lg"
                >
                  <span className="text-emerald-500 text-md">✓</span> {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action-del (Apply) */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-md font-bold text-gray-400">Status</p>
            <p
              className={`text-sm font-bold ${job.status === "closed" ? "text-red-500" : "text-green-600"}`}
            >
              {job.status === "closed"
                ? "Closed"
                : "Open & Accepting Applications"}
            </p>
          </div>

          <button
            disabled={job.status === "closed"}
            onClick={() => {
              // 🎯 HÄR triggar vi din Apply-Modal eller öppnar formuläret!
              alert("Här öppnar vi ansökningsformuläret! 🚀");
            }}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all text-center ${
              job.status === "closed"
                ? "bg-red-50 text-red-500 border border-red-200 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-950 cursor-pointer shadow-md shadow-black/5"
            }`}
          >
            {job.status === "closed" ? "Closed" : "Apply for this job"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default JobDetails;
