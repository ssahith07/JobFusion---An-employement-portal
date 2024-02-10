// import React, { useEffect, useRef, useState } from "react";
// import Jobs from "./Jobs";
// import { Link, Navigate,useNavigate, useParams } from "react-router-dom";
// import "../App.css";
// // import Modell from "../components/Modell";
// // import Extends from "./Extends";
// import {FiCalendar, FiClock, FiDollarSign, FiMapPin} from 'react-icons/fi'

// const AppliedJobs = () => {
//   const navigate = useNavigate();

//   const [jobs, setJobs] = useState([]);
//   const notesIntial = [];

//   // const [notes, setnote] = useState(notesIntial);
//   // const [isLoading, setIsLoading] = useState(true);
  
//   useEffect(() => {
//     d();
//   }, []);
//   const d = async () => {
//     const response = await fetch(`http://localhost:5000/applied-jobs`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         'Authorization': 'bearer ' + localStorage.getItem("token"),
//       },
//     });
//     // Api call
//     // console.log("geting all note")
//     const job = await response.json();
//     console.log(job);
//     setJobs(job);
//   };
//   // const [isModalOpen, setIsModalOpen] = useState(false);

//   // const result=data;

//   // const {_id, JobTitle,companyName,minPrice,maxPrice,salaryType,jobLocation,postingDate,experienceLevel,employmentType,description,companyLogo,postedBy,skills} = jobs;
//   const handleClick = () => {
//       console.log();

//       // <Extends  ></Extends>
      
//       navigate("/extends");
//     // <Modell/>
    
//   };

//   const {
//     _id,
//     companyName,
//     companyLogo,
//     JobTitle,
//     minPrice,
//     maxPrice,
//     experienceLevel,
//     salaryType,
//     jobLocation,
//     employmentType,
//     postingDate,
//     description,
//     postedBy,
//     skills,
//   } = jobs;

//   return (
//     <>
//       <div className="col-span-2 bg-white p-4 rounded-sm">
//         <ul>
//           {jobs.length != 0 &&
//             jobs.map((user) => {
//               return (
//                 <li key={user.id}>
//                   <section className="max-w-screen-2xl container mx-auto xl:px-24 px-4 mt-10">
//                     <img
//                       src={companyLogo}
//                       alt="Company Logo"
//                       className="h-36 w-36 rounded"
//                     />
//                     <div>
//                       {/* <div className="box-card"  onClick={handleClick}> */}
//                         <div className="box-card"  >
//                         <div className="card-header">
//                           <h2>{user.companyName}</h2>
//                           <h4>{user.JobTitle}</h4>
//                         </div>
//                         <div>
//                           <p> <span className='flex items-center gap-2'><FiMapPin/>{user.jobLocation}</span></p>
//                          <p>
                         
//                          </p>
//                           <p>
//                     <span className='flex items-center gap-2'><FiClock/>{user.employmentType}</span>
//                     <span className='flex items-center gap-2'><FiDollarSign/>{user.minPrice}-{user.maxPrice}</span>
//                     <span className='flex items-center gap-2'><FiCalendar/>{user.postingDate}</span>
//                     </p>
//                         </div>
//                         <div className="card-body">
//                           <p>{user.description}</p>
//                         </div>
//                       </div>
//                       {/* <h4 className="text-primary mb-1">{companyName}</h4>
//                       <h3 className="text-lg font-semibold mb-2">{JobTitle}</h3>
//                       <div className="text-primary text-3xl text-bold flex flex-wrap gap-2 mb-2">
//                         <ol className="list-decimal my-4">
//                           <li>Company Name: {user.companyName}</li>
//                           <li>Designation: {user.JobTitle}</li>
//                         </ol>
//                       </div>
//                       <p className="text-base text-primary/70">{description}</p> */}
//                     </div>
//                   </section>
//                 </li>
//               );
//             })}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default AppliedJobs;


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


// import React, { useEffect, useState } from "react";
// import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
// import { useNavigate, Link } from "react-router-dom";
// import "../App.css";

// const AppliedJobs = () => {
//   const navigate = useNavigate();
//   const [jobs, setJobs] = useState([]);

//   useEffect(() => {
//     fetchAppliedJobs();
//   }, []);

//   const fetchAppliedJobs = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/applied-jobs`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           'Authorization': 'bearer ' + localStorage.getItem("token"),
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch applied jobs");
//       }

//       const jobData = await response.json();
//       setJobs(jobData);
//     } catch (error) {
//       console.error("Error fetching applied jobs:", error.message);
//     }
//   };

//   return (
//     <div className="col-span-2 bg-white p-4 rounded-sm">
//       <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {jobs.length !== 0 && jobs.map((job) => (
//           <li key={job?._id}>
//             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
//               {job?.companyLogo && (
//                 <img
//                   src={job.companyLogo}
//                   alt="Company Logo"
//                   className="w-40 h-32  object-center"
//                 />
//               )}
//               <div className="p-4">
//                 <h2 className="text-xl font-semibold mb-2">{job?.companyName}</h2>
//                 <h4 className="text-lg font-medium mb-2">{job?.JobTitle}</h4>
//                 <p className="text-gray-600 mb-4 line-clamp-3">{job?.description}</p>
//                 <div className="flex justify-between items-center">
//                   <div className="flex space-x-2 items-center">
//                     <span className='flex items-center gap-2 text-gray-600'><FiMapPin />{job?.jobLocation}</span>
//                     <span className='flex items-center gap-2 text-gray-600'><FiClock />{job?.employmentType}</span>
//                     <span className='flex items-center gap-2 text-gray-600'><FiDollarSign />{job?.minPrice}-{job?.maxPrice}</span>
//                   </div>
//                   <Link to={`/job-details/${job?._id}`} className="text-blue-500 hover:underline">View Details</Link>
//                 </div>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AppliedJobs;
