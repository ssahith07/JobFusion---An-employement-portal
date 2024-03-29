import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Checkmark } from 'react-checkmark';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin, FiX } from 'react-icons/fi'

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [applied, setApplied] = useState([]);
  const [accept, setAccept] = useState([]);
  const [reject, setReject] = useState([]);
  const [short, setShort] = useState([]);
  const sect = localStorage.getItem("selectedSector");
  const logo = "https://i.ibb.co/2NTT5xs/NE-Preview1-1.png";
  const resume = localStorage.getItem("resume");
  const seeker = localStorage.getItem('id');
  console.log(resume)
  useEffect(() => {
    if (sect === "private") {
      fetch(`http://localhost:5000/all-jobs/${id}`)
        .then((res) => res.json())
        .then((data) => setJob(data));
    } else if (sect === "governement") {
      fetch(`http://localhost:5000/all-gjobs/${id}`)
        .then((res) => res.json())
        .then((data) => setJob(data));
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/applied", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setApplied(data.jobsApplied));
  }, []);

  const handleApply = async () => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/apply-job/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seekerId: id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    alert("Applied to the job successfully!!");
    window.location.reload();
  };

  const {
    _id,
    companyName,
    companyLogo,
    JobTitle,
    minPrice,
    maxPrice,
    salaryType,
    jobLocation,
    employmentType,
    postingDate,
    description,
    JobSector,
    jobDepartment,
    startDate,
    endDate,
    skills,
    govtlink,
  } = job;

  const app = applied ? applied.find((item) => item === _id) : null;
  // console.log(app);


  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/acc-rej/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setShort(data);
        console.log(data);
        setAccept(data.accepted || []);
        setReject(data.rejected || []);
      });
  }, []);

  const { accepted, rejected } = short;
  console.log(accept, reject)

  return (
    <>
      {sect === "private" ? (
        <section className="max-w-screen-2xl container mx-auto xl:px-24 px-4 mt-10">
          <Link
            to={`/job-details/${_id}`}
            className="flex gap-4 flex-col sm:flex-row items-start"
          >
            <img
              src={companyLogo}
              alt="Company Logo"
              className="h-36 w-36 rounded"
            />
            <div>
              <h4 className="text-primary mb-1">{companyName}</h4>
              <h3 className="text-lg font-semibold mb-2">{JobTitle}</h3>
              <div className="text-primary text-3xl text-bold flex flex-wrap gap-2 mb-2">
                <ol className="list-decimal my-4">
                  <li>Company Name: {companyName}</li>
                  <li>Designation: {JobTitle}</li>
                </ol>
              </div>
              {!app ? (
                resume ? (
                  <button
                    className="bg-green px-8 py-2 my-2 text-white rounded-full"
                    onClick={handleApply}
                  >
                    Apply Now
                  </button>
                ) : (
                  <button
                    className="bg-green px-8 py-2 my-2 text-white rounded-full"
                    onClick={() => {
                      alert("Please Upload your profile to apply jobs!!!");
                    }}
                  >
                    Apply Now
                  </button>
                )
              ) : (
                <>
                  <button
                    disabled={true}
                    className="bg-gray-500 px-8 py-2 my-2 text-white rounded-full"
                  >
                    Applied
                  </button>
                  {!(accept.includes(seeker) || reject.includes(seeker)) ? (<span className="px-4 font-normal flex gap-2 text-gray-500">
                    <FiClock />Application Pending - Awaiting Recruiters' Response
                  </span>) :
                    (accept.includes(seeker)) ?
                      (
                        <span className="px-4 font-normal gap-2 flex text-gray-500">
                          <Checkmark size='medium' />
                          Application Accepted - Congratulations! You will soon receive a call or email from the recruiter for further instructions and next steps in the hiring process.
                        </span>) :
                      (<span className="px-4 flex font-normal text-gray-500">
                        <svg className="crossmark" xmlns="http://www.w3.org/2000/svg" style={{ width: '3em', height: '3em', marginRight: '0.2em', verticalAlign: 'middle' }} viewBox="0 0 52 52">
                          <circle className="crossmark__circle" cx="26" cy="26" r="25" fill="none"></circle>
                          <path className="crossmark__cross" fill="none" stroke="#ff0000" strokeWidth="3" d="M16 16 36 36 M36 16 16 36"></path>
                        </svg>
                        Application Rejected - We appreciate your interest. Unfortunately, your application was not successful for this position. Keep exploring opportunities, and we wish you the best in your job search
                      </span>)}
                </>
              )}
              <div className="text-primary text-xl text-bold flex flex-wrap gap-16 mb-2">
                <ol className="list-decimal my-4 space-y-4">
                  <li>Key Points :</li>
                  <li>Job Posted On : {postingDate}</li>
                  <li>Salary : {salaryType}</li>
                  <li>Location: {jobLocation}</li>
                  <li>Employment Type: {employmentType}</li>
                  <li>
                    Salary Range: {minPrice}$ to {maxPrice}
                  </li>
                </ol>
                <label className="block mb-2 text-lg">
                  Required Skill Sets :{" "}
                </label>
                <ul>
                  {skills &&
                    Array.isArray(skills) &&
                    skills.map((skill, index) => (
                      <li key={index}>{skill.label}</li>
                    ))}
                </ul>
              </div>
              <p className="text-base text-primary/70 mb-4">
                This role presents a unique chance for career growth in the
                private sector. Private jobs often offer competitive salaries,
                diverse career paths, and a dynamic work environment. As you
                consider applying, take note of the specific skill requirements
                and company culture outlined in the job description. Tailor your
                application to highlight how your skills align with the needs of
                the employer. The application process is seamless, and JobFusion
                ensures your privacy throughout. We wish you the best as you
                embark on this journey toward a rewarding career in the private
                industry.
              </p>
              <p className="text-base text-primary/70">{description}</p>
            </div>
          </Link>
        </section>
      ) : (
        <section className="max-w-screen-2xl container mx-auto xl:px-24 px-4 mt-10">
          <Link
            to={`/job-details/${_id}`}
            className="flex gap-4 flex-col sm:flex-row items-start"
          >
            <img src={logo} alt="Company Logo" className="h-32 w-40 rounded" />
            <div>
              <h4 className="text-primary mb-1">{JobSector}</h4>
              <h3 className="text-lg font-semibold mb-2">{JobTitle}</h3>
              <div className="text-primary text-3xl text-bold flex flex-wrap gap-2 mb-2">
                <ol className="list-decimal my-4">
                  <li>Sector: {JobSector}</li>
                  <li>Designation: {JobTitle}</li>
                </ol>
              </div>
              <div className="text-primary text-xl text-bold flex flex-wrap gap-2 mb-2">
                <ol className="list-decimal my-4">
                  <li>
                    Application Period: {startDate} to {endDate}
                  </li>
                  <li>Department: {jobDepartment}</li>
                  <li>Location: {jobLocation}</li>
                  Employment Type: {employmentType}
                </ol>
                <p className="text-base text-primary/70 mb-4">
                  Applying for government jobs is a unique opportunity to
                  contribute to public service. Ensure you thoroughly understand
                  the role, and align your skills and experiences with the job
                  requirements. Government jobs often come with a sense of
                  responsibility and impact on the community. Take your time to
                  craft a detailed application that highlights your
                  qualifications and dedication to serving the public.
                </p>
              </div>
              <p className="text-base text-primary/70">{description}</p>
            </div>
          </Link>

          <a
            href={govtlink}
            target="_blank"
            className="bg-green px-8 py-2 my-2 text-white rounded-full"
          >
            Apply Now
          </a>
        </section>
      )}
    </>
  );
};

export default JobDetails;
