const JobCard = ({ job }) => {
  const { title, company, location, salary, description } = job;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
          New
        </span>
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
        <button className="w-full md:w-auto px-5 py-2.5 bg-gray-950 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
