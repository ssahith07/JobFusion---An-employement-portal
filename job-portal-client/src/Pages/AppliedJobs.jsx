import React, { useEffect, useState } from "react";
import Jobs from "./Jobs";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { useNavigate,Link } from "react-router-dom";
import "../App.css";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/applied-jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'bearer ' + localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applied jobs");
      }

      const jobData = await response.json();
      setJobs(jobData);
    } catch (error) {
      console.error("Error fetching applied jobs:", error.message);
    }
  };

  return (
    <div className="col-span-2 bg-white p-4 rounded-sm">
  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {jobs.length !== 0 && jobs.map((job) => (
      <li key={job._id}>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
          <img
            src={job.companyLogo}
            alt="Company Logo"
            className="w-40 h-32  object-center"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{job.companyName}</h2>
            <h4 className="text-lg font-medium mb-2">{job.JobTitle}</h4>
            <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <span className='flex items-center gap-2 text-gray-600'><FiMapPin />{job.jobLocation}</span>
                <span className='flex items-center gap-2 text-gray-600'><FiClock />{job.employmentType}</span>
                <span className='flex items-center gap-2 text-gray-600'><FiDollarSign />{job.minPrice}-{job.maxPrice}</span>
              </div>
              <Link to={`/job-details/${job._id}`} className="text-blue-500 hover:underline">View Details</Link>
            </div>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

  );
};

export default AppliedJobs;


// updated