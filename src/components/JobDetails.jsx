import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [Loading, setLoading] = useState(true);

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

  if (Loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          Loading job details...
        </p>
      </div>
    );
  }

  if (job) {
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
  return <></>;
};
export default JobDetails;
