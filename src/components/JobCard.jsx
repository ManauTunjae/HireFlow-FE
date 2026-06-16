const JobCard = ({ job, onApply }) => {
  const { title, company, location, salary, description } = job;

  const getJobBadge = (createdAt, status) => {
    if (status === "closed") {
      return {
        text: "Closed",
        style: "bg-red-950 text-red-400 border border-red-900/40",
      };
    }

    if (!createdAt) return null;

    const createdDate = new Date(createdAt);
    const today = new Date();

    const diffTime = Math.abs(today - createdAt);
    const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDay <= 5) {
      return {
        text: "New",
        style:
          "bg-blue-950 text-blue-400 border border-blue-800/30 animate-pulse text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
      };
    }

    if (diffDay >= 7 && diffDay <= 14) {
      return {
        text: "Closing Soon ⏳",
        style:
          "bg-amber-950 text-amber-400 border border-amber-900/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
      };
    }

    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-2">
        <div className="space-x-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            New
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
              job.status === "open"
                ? "bg-green-100 text-green-700 border border-green-200"
                : job.status === "draft"
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {job.status || "open"}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>

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
      <div className="flex items-center mt-4 md:mt-0">
        <button
          onClick={onApply}
          className="w-full md:w-auto px-5 py-2.5 bg-gray-950 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
