import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const MyJobs = () => {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSect, setSelectedSect] = useState('p');
  const email = localStorage.getItem('email');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // if(selectedSector==='private'){}
      try {
        const response = await fetch(`http://localhost:5000/my${selectedSect}Jobs/${email}`);
        const data = await response.json();

        // console.log('API Response:', data);
        setFilteredJobs(data);
        setJobs(data);
        setIsLoading(false);
      } catch (error) {
        // console.error('API Error:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedSect,searchText]);


//   pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

//  next and prev btns
  const nextPage = () =>{
    if (indexOfLastItem<jobs.length) {
        setCurrentPage(currentPage + 1);
    }
  }

  const prevPage = () =>{
    if (currentPage>1) {
        setCurrentPage(currentPage-1);
    }
  }


  const handleSearch = () => {
    if (searchText === "") {
      // If search text is empty, showing all jobs
      setFilteredJobs(jobs);
    } else {
      // Filtering the jobs based on search text
      const filteredJobs = jobs.filter((job) =>
        job.JobTitle.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredJobs(filteredJobs);
    }
  };
  
  const handleDelete = (id, selectedSect) => {
    const endpoint = selectedSect === 'p' ? `http://localhost:5000/job/${id}` : `http://localhost:5000/gjob/${id}`;
    console.log(selectedSect)
    fetch(endpoint, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(id)
        if (data.acknowledged === true) {
          alert('!!! Job Delete successfully !!!');
          // Updating the jobs state after successful deletion
          setFilteredJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
          setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
          setCurrentPage(1);
        }
      });
  };

    return (
      
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            <div className='my-jobs-container'>
                <h1 className='text-center p-4'>My Jobs</h1>
                <div className='search-box p-2 text-center mb-2'>
                    <input type="text" name='search' id='search' className='py-2 pl-3 border focus:outline-none lg:w-6/12 mb-4 w-full'
                        onChange={(e) => setSearchText(e.target.value)} />
                    <button className='bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4' onClick={handleSearch}>Search</button>
                </div>
                <div className='flex justify-center space-x-4 mb-4'>
          <button
            className={`${selectedSect === 'p' ? 'bg-blue text-white' : 'bg-gray-200'} text-blue font-semibold px-4 py-2 rounded-sm`}
            onClick={() => setSelectedSect('p')}
          >
            Private Jobs
          </button>
          <button
            className={`${selectedSect === 'g' ? 'bg-blue text-white' : 'bg-gray-200'} text-blue font-semibold px-4 py-2 rounded-sm`}
            onClick={() => setSelectedSect('g')}
          >
            Government Jobs
          </button>
        </div>
      </div>

            {/* Jobs list */}
            <section className="py-1 bg-blueGray-50">
<div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-5">
  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
    <div className="rounded-t mb-0 px-4 py-3 border-0">
      <div className="flex flex-wrap items-center">
        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 className="font-semibold text-base text-blueGray-700">All Jobs</h3>
        </div>
        <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
          <Link to="/post-job" className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 hover:bg-purple-500 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">Post a new Job</Link>
        </div>
      </div>
    </div>


    <div className="block w-full overflow-x-auto">
      <table className="items-center bg-transparent w-full border-collapse ">
        <thead>
          <tr>
            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
            NO.
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          JOB TITLE
                        </th>
           <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          {selectedSect==='p'?`COMPANY NAME`:`JOB SECTOR`}
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          {selectedSect==='p'?`SALARY`:`DATE`}
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          EDIT
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          DELETE
                        </th>
          </tr>
        </thead>

        {
  isLoading ? (
    <div className='flex items-center justify-center h-20'>
      <p>loading.....</p>
    </div>
  ) : (
    <tbody>
      {currentJobs.map((job,index) => (
    
              <tr key={index}>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 text-left text-blueGray-700 ">
                  {indexOfFirstItem+index+1}
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4 ">
                  {job.JobTitle}
                </td>
                <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-s whitespace-nowrap p-4">
                {selectedSect === 'p' ? job.companyName : job.JobSector}

                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4">
                {selectedSect === 'p' ? `${job.minPrice}-${job.maxPrice}` : `${job.startDate} to ${job.endDate}`}

                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-s whitespace-nowrap p-4">
                 
                  <button className='hover:underline duration-500'><Link to={selectedSect === 'p' ? `/edit-job/${job?._id}` : `/edit-gjob/${job?._id}`}>Edit</Link></button>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <button onClick={()=> handleDelete(job._id,selectedSect)} className='bg-red-700 py-2 px-6 text-white rounded-sm hover:bg-red-500'>Delete</button>
                </td>
              </tr>
                     ))}
                     </tbody>
                   )
                 }


      </table>
    </div>
  </div>
</div>

{/* pagination */}
    <div className='flex justify-center text-black space-x-8 mb-8'>
       {
        currentPage> 1 && (
            <button className='hover:underline' onClick={prevPage}>Previous</button>
        )
       }
       {
        indexOfLastItem < jobs.length && (
            <button className='hover:underline' onClick={nextPage}>Next</button>
        )
      }
    </div>

</section>
        </div>
    )
}

export default MyJobs
