import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const { title, company, location, salary, description, createdAt, status } =
    job;
  const navigate = useNavigate();

  const getJobBadge = (createdTime, status) => {
    if (status === "closed") {
      return {
        text: "Closed",
        style: "bg-red-100/30 text-red-600 border border-red-300/40",
      };
    }

    if (!createdTime) return null;

    const createdDate = new Date(createdTime);
    const today = new Date();

    const diffTime = Math.abs(today - createdDate);
    const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDay <= 5) {
      return {
        text: "New",
        style:
          "bg-blue-100/40 text-blue-400 border border-blue-500/30 animate-pulse text-[15px] font-black uppercase px-2 py-1 rounded-full",
      };
    }

    if (diffDay >= 7 && diffDay <= 14) {
      return {
        text: "Closing Soon ⏳",
        style:
          "bg-yellow-100/30 text-amber-500 border border-amber-500/30 text-[15px] font-black uppercase px-2 py-1 rounded-full",
      };
    }

    return null;
  };

  const badge = getJobBadge(createdAt, status);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-2">
        <div className="justify-between flex items-center gap-2">
          {badge && (
            <span
              className={`text-[15px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider border ${badge.style}`}
            >
              {badge.text}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 pt-1">{title}</h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            {company || "Company Name"}
          </span>
          <span className="flex items-center gap-1">
            {location || "Location"}
          </span>
          {salary && (
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              {salary}
            </span>
          )}
        </div>
        {description && (
          <p className="text-gray-600 text-sm line-clamp-2 mt-2 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center mt-4 md:mt-0 shrink-0">
        <button
          onClick={() => navigate(`/jobs/${_id}`)}
          className="w-full md:w-auto px-5 py-2.5 text-sm font-semibold border border-gray-400/70 rounded-lg transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
export default JobCard;
