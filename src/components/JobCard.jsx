import React from "react";

const JobCard = ({ job }) => {
  const { title, company, location, salary, description } = job;

  return (
    <div>
      <div>
        <span>New</span>
        <h3>{title}</h3>
        <div>
          <span>{company || "Company Name"}</span>
          <span>{location || "Location"}</span>
          {salary && <span>{salary}</span>}
        </div>
        {description && <p>{description}</p>}
      </div>
      <div>
        <button>Apply Now</button>
      </div>
    </div>
  );
};

export default JobCard;
