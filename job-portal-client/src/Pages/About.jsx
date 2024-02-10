import React from 'react';
import recruiterImage from '../images/recruiter.png';  
import seekerImage from '../images/seeker.jpg';        

const About = () => {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to JobFusion</h1>
      
      <section className="flex justify-around items-start mt-8 space-x-4">
        <div className="user-type-container bg-white rounded-lg p-6 max-w-md">
          <img src={recruiterImage} alt="Recruiter" className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Recruiters</h2>
          <p className="text-gray-700">
            As a recruiter on JobFusion, you have the power to connect with talented individuals
            and make a significant impact on their careers. Whether you are looking for skilled
            professionals for private sector roles or contributing to the public sector by posting
            government jobs, JobFusion provides a platform for seamless recruitment.
          </p>
        </div>

        <div className="user-type-container bg-white rounded-lg p-6 max-w-md">
          <img src={seekerImage} alt="Seeker" className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Job Seekers</h2>
          <p className="text-gray-700">
            JobFusion is dedicated to helping you find the right opportunities to grow your career.
            Explore a variety of job listings, both from private companies and government sectors.
            Our user-friendly platform makes job hunting and application processes efficient and straightforward.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-700">
          At JobFusion, our mission is to bridge the gap between recruiters and job seekers.
          We aim to create a dynamic platform that fosters meaningful connections, facilitates
          career growth, and contributes to the overall development of the workforce.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-2">Recruiters can post both private and government jobs.</li>
          <li className="mb-2">Intuitive job search and application process for seekers.</li>
          <li className="mb-2">Robust tools for recruiters to find the right candidates.</li>
          <li className="mb-2">Regular updates and notifications for both recruiters and seekers.</li>
        </ul>
      </section>
    </div>
  );
}

export default About;
