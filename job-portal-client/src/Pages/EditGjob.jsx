import { useLoaderData, useParams } from 'react-router-dom';
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import CreatableSelect from 'react-select/creatable'

const EditGjob = () => {
    const {id} = useParams();
    // console.log(id)
    const {JobTitle,JobSector,startDate,endDate,jobDepartment,jobLocation,postingDate,experienceLevel,govtlink,employmentType,description,postedBy} = useLoaderData();

    const [selectedOption, setSelectedOption] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    // console.log(data)
    fetch(`http://localhost:5000/edit-gjob/${id}`, {
      method: "PATCH",
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) =>{
      console.log(result);
      if (result.acknowledged === true){
        alert("!!! Job Has Edited Successfully !!!");
      }
      reset()
    })
  }

  const options = [
    { value: "javascript", label: "javascript" },
    { value: "C++", label: "C++" },
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "React", label: "React" },
    { value: "Node", label: "Node" },
    { value: "Redux", label: "Redux" },
  ]
  return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
          <div className='bg-[#FAFAFA] py-10px-4 lg:px-16'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5 py-5'>
          <div className='create-job-flex'>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'>Job Title</label>
              <input type="text" pattern='[a-zA-Z ]+' placeholder="Ex:General Manager" defaultValue={JobTitle} {...register("JobTitle",)} className='create-job-input' required/>
            </div>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'>Job Sector</label>
              <input type="text" pattern='[a-zA-Z ]+' placeholder="Ex:Railway" defaultValue={JobSector} {...register("JobSector",)} className='create-job-input' required/>
            </div>
          </div>

          {/* 2nd Row */}

          <div className='create-job-flex'>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'>Start Date</label>
              <input type="date" placeholder="Ex:7/12/2023" defaultValue={startDate} {...register("startDate",)} className='create-job-input' required/>
            </div>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'>End Date</label>
              <input type="date" placeholder="Ex:7/12/2023" defaultValue={endDate} {...register("endDate",)} className='create-job-input' required/>
            </div>
          </div>

          {/* 3rd row */}

          <div className='create-job-flex'>          
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'>Job Department</label>
              <input type="text" pattern='[a-zA-Z ]+' placeholder="Ex:Administration" defaultValue={jobDepartment} {...register("jobDepartment",)} className='create-job-input' required/>
            </div>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'>Job Location</label>
              <input type="text" pattern='[a-zA-Z ]+' placeholder="Ex:Hyderabad" defaultValue={jobLocation} {...register("jobLocation",)} className='create-job-input' required/>
            </div>
          </div>

          {/* 4th row */}

          <div className='create-job-flex'>
            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'>Job Posting Date</label>
              <input type="date" placeholder="Ex:7/12/2023" defaultValue={postingDate} {...register("postingDate",)} className='create-job-input' required/>
            </div>

            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'>Experience Level</label>
              <select {...register("experienceLevel")} className='create-job-input' required>
              <option value={experienceLevel}>{experienceLevel}</option>
                <option value="NoExperience">No Experience</option>
                <option value="Internship">Internship</option>
                <option value="Work remotely">Work remotely</option>
              </select>
            </div>

          </div>

          {/* 6th row */}
          <div className='create-job-flex'>
            <div className='lg:w-1/2 w-full'>


              <label className='block mb-2 text-lg'>Governement Job link</label>
              <input type="url" placeholder="Paste your company logo URL: https://" {...register("govtlink",)} className='create-job-input' required/>
            </div>

            <div className='lg:w-1/2 w-full'>
              <label className='block mb-2 text-lg'>EmploymentType</label>
              <select {...register("employmentType")} className='create-job-input' required>
              <option value={employmentType}>{employmentType}</option>
                <option value="Full-time">Permanent</option>
                <option value="Part-time">Contract</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>

          </div>

          {/* 7th row */}
          <div className='w-full'>
            <label className='block mb-2 text-lg'>Job Description</label>
            <textarea className='w-full pl-3 py-1.5 focus-outline-none placeholder:text-gray-700'
            rows={6}
            defaultValue={description}            
            placeholder='Job Description'
            {...register("description",)} required/>
          </div>
        {/* 8th row */}
        <div className='w-full'>
          <label className='block mb-2 text-lg'>Recruiter</label>
          <input type="email" pattern="[^ @]*@[^ @]*" placeholder="Your email" defaultValue={postedBy} {...register("postedBy",)} className='create-job-input' required/>
        </div>

          <input type="submit" className='block mt-12 bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer' />
        </form>
          </div>
        </div>
      
  )
}

export default EditGjob
