import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Save, Trash2 } from "lucide-react";

const PostResume = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState(null);
  const token = localStorage.getItem("token");
  const sid = localStorage.getItem("id");

  useEffect(() => {
    const url = `http://localhost:5000/profile-info/${sid}`;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    fetch(url, { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setInfo(data);
        localStorage.setItem("resume", true);
        data ? setIsResumeUploaded(true) : setIsResumeUploaded(false);
        reset({
          fullName: data.fullName || "",
          email: data.email || "",
          number: data.number || "",
          description: data.description || "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      
      if (isEditing) {
        // Handle profile update with possible resume
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("number", data.number);
        formData.append("description", data.description);
        
        // Only append resume if a new file is selected
        if (data.resume && data.resume[0]) {
          formData.append("resume", data.resume[0]);
        }
  
        const updateResponse = await fetch(`http://localhost:5000/update-profile/${sid}`, {
          method: "PUT",
          body: formData,
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        const updateResult = await updateResponse.json();
        
        if (updateResult.acknowledged === true) {
          setIsEditing(false);
          alert("Profile updated successfully!");
        }
      } else {
        // Handle new submission
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("number", data.number);
        formData.append("description", data.description);
        formData.append("resume", data.resume[0]);
  
        const submitResponse = await fetch("http://localhost:5000/post-res", {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        const submitResult = await submitResponse.json();
  
        if (submitResult.acknowledged === true) {
          setIsResumeUploaded(true);
          alert("Resume has been uploaded successfully!");
        }
      }
    } catch (error) {
      console.error(isEditing ? "Error updating profile:" : "Error uploading resume:", error);
      alert(isEditing ? "Failed to update profile" : "Failed to upload resume");
    }
  };
  
 
  const deleteResume = async () => {
    if (window.confirm("Are you sure you want to delete your resume?")) {
      try {
        const response = await fetch(`http://localhost:5000/all-res/${sid}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (result.acknowledged === true) {
          setIsResumeUploaded(false);
          alert("Resume has been deleted successfully!");
          localStorage.removeItem("resume");
          localStorage.removeItem("info");
          reset();
        }
      } catch (error) {
        console.error("Error deleting resume:", error);
      }
    }
  };

  const viewRes = async () => {
    try {
      const response = await fetch(`http://localhost:5000/view-res/${sid}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resume");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error getting the resume: ", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form className="bg-white rounded-lg shadow-md p-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Applicant Information
            </h3>
            <p className="mt-2 text-gray-600">
              Personal details and application
            </p>
          </div>
          {isResumeUploaded && (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={viewRes}
                className="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-blue transition-colors"
              >
                View Resume
              </button>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-green transition-colors"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-green transition-colors"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                {...register("fullName")}
                type="text"
                pattern="[a-zA-Z ]+"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
                disabled={isResumeUploaded && !isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
                disabled={isResumeUploaded && !isEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              {...register("number")}
              type="tel"
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={isResumeUploaded && !isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={6}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="About Yourself"
              required
              disabled={isResumeUploaded && !isEditing}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume
              </label>
              <input
                {...register("resume")}
                type="file"
                accept="application/pdf"
                required={!isResumeUploaded}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={isResumeUploaded && !isEditing}
              />
            </div>
            {isResumeUploaded && (
              <button
                type="button"
                onClick={deleteResume}
                className="inline-flex items-center gap-2 px-4 py-2 mt-6 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Delete Resume
              </button>
            )}
          </div>
        </div>

        {!isResumeUploaded && (
          <button
            type="submit"
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Application
          </button>
        )}
      </form>
    </div>
  );
};

export default PostResume;


// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useParams } from "react-router-dom";

// const PostResume = () => {
//   const { register, handleSubmit, reset } = useForm();
//   const [isResumeUploaded, setIsResumeUploaded] = useState(false);
//   const [email, setEmail] = useState("");
//   const [resume, setResume] = useState(false);
//   const [profile, setProfile] = useState([]);
//   const [info, setInfo] = useState(null);
//   const token = localStorage.getItem("token");
//   const sid = localStorage.getItem("id");

//   useEffect(() => {
//     const resinfo = info;

//     console.log(resinfo);
//     console.log(sid);
//     const url = `http://localhost:5000/profile-info/${sid}`;
//     const headers = {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     };

//     fetch(url, { headers })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setInfo(data);
//         localStorage.setItem("resume", true);
//         data ? setIsResumeUploaded(true) : setIsResumeUploaded(false);
//         reset({
//           fullName: data.fullName || "",
//           email: data.email || "",
//           number: data.number || "",
//           description: data.description || "",
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);
//   console.log(info);

//   const onSubmit = async (data) => {
//     const formData = new FormData();
//     formData.append("fullName", data.fullName);
//     formData.append("email", data.email);
//     formData.append("number", data.number);
//     formData.append("description", data.description);
//     formData.append("resume", data.resume[0]);

//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch("http://localhost:5000/post-res", {
//         method: "POST",
//         body: formData,
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       const resumes = await response.json();

//       if (resumes.acknowledged === true) {
//         //setResume(resumes);
//         setIsResumeUploaded(true);
//         setProfile(JSON.stringify(data));
//         // setEmail(data.email);
//         // setInfo(data);
//         // setResume(true);
//         // localStorage.setItem('email', data.email);
        
//         // localStorage.setItem("info", JSON.stringify(data));

//         alert("Resume has been uploaded successfully!");
        
//         //   window.reload();
//       }
//     } catch (error) {
//       console.error("Error uploading resume:", error);
//     }
//   };
//   // console.log(profile);

//   // console.log(email);

//   const deleteResume = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:5000/all-res/${id}`, {
//         method: "DELETE",
//         headers:{
//           "Authorization":`Bearer ${token}`
//         }
//       });

//       const result = await response.json();
//       console.log(id);
//       if (result.acknowledged === true) {
//         setIsResumeUploaded(false);
//         alert("Resume has been deleted successfully!");

//         // localStorage.removeItem('email');
//         localStorage.removeItem("resume");
//         localStorage.removeItem("info");
//         reset();
//       }
//     } catch (error) {
//       console.error("Error deleting resume:", error);
//     }
//   };

//   const viewRes = async (id) => {
//     try {
//       const token = localStorage.getItem("token"); // Get the token from localStorage
  
//       const response = await fetch(`http://localhost:5000/view-res/${id}`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`, // Add the token to the request headers
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to fetch resume");
//       }
  
//       // Convert the response to a Blob (binary data)
//       const blob = await response.blob();
  
//       // Create a URL for the Blob and open it in a new tab
//       const url = window.URL.createObjectURL(blob);
//       window.open(url, "_blank");
//     } catch (error) {
//       console.error("Error getting the resume: ", error);
//     }
//   };

//   return (
//     <>
//       <form
//         className="px-8 py-8 bg-gray-100"
//         encType="multipart/form-data"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <div className="px-4 sm:px-0">
//           <h3 className="text-xl font-semibold leading-7 text-gray-900">
//             Applicant Information
//           </h3>
//           <p className="mt-1 max-w-2xl text-lg leading-6 text-gray-500">
//             Personal details and application.
//           </p>
//           {/* <div className='flex justify-end'>
//         <button className='flex text-lg justify-end text-purple-600 hover:underline'>View Resume</button>
//         </div> */}
//         </div>
//         <div className="mt-6 border-t border-gray-100">
//           <dl className="divide-y divide-gray-100">
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-lg font-medium leading-6 text-gray-900">
//                 Full name
//               </dt>
//               <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 <input
//                   {...register("fullName")}
//                   //sdefaultValue={info.fullName}
//                   type="text"
//                   pattern="[a-zA-Z]+"
//                   className="border border-gray-300 rounded-md p-2 w-full"
//                   required
//                 />
//               </dd>
//             </div>
//           </dl>
//         </div>
//         <div className="mt-6 ">
//           <dl className="divide-y divide-gray-100">
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-lg font-medium leading-6 text-gray-900">
//                 Email
//               </dt>
//               <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 <input
//                   {...register("email")}
//                   // value={resinfo.email}
//                   type="email"
//                   className="border border-gray-300 rounded-md p-2 w-full"
//                   required
//                 />
//               </dd>
//             </div>
//           </dl>
//         </div>
//         <div className="mt-6">
//           <dl className="divide-y divide-gray-100">
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-lg font-medium leading-6 text-gray-900">
//                 Mobile Number
//               </dt>
//               <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 <input
//                   {...register("number")}
//                   type="tel"
//                   pattern="[0-9]{10}"
//                   required
//                   className="border border-gray-300 rounded-md p-2 w-full"
//                 />
//               </dd>
//             </div>
//           </dl>
//         </div>
//         <div className="mt-6">
//           <dl className="divide-y divide-gray-100">
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-lg font-medium leading-6 text-gray-900">
//                 Description
//               </dt>
//               <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 <textarea
//                   className="w-full pl-3 py-1.5 focus-outline placeholder:text-gray-700"
//                   rows={6}
//                   placeholder="About Yourself"
//                   {...register("description")}
//                   required
//                 />
//               </dd>
//             </div>
//           </dl>
//         </div>
//         <div className="mt-6">
//           <dl className="divide-y divide-gray-100">
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-lg font-medium leading-6 text-gray-900">
//                 Resume
//               </dt>
//               <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 <input
//                   {...register("resume")}
//                   type="file"
//                   accept="application/pdf"
//                   required
//                   className="border border-gray-300 rounded-md p-2 w-full"
//                 />
//               </dd>
//             </div>
//           </dl>
//         </div>
//         <div className="mt-6 px-4 sm:px-0">
//           {!isResumeUploaded ? (
//             <button
//               type="submit"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-blue focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             >
//               Submit Application
//             </button>
//           ) : (
//             <button
//               type="submit"
//               disabled={true}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             >
//               Submit Application
//             </button>
//           )}

//           <div className="flex justify-end mt-6 px-4 sm:px-0">
//             {isResumeUploaded && (
//               <>
//                 <button
//                   type="button"
//                   onClick={() => deleteResume(sid)}
//                   // {...console.log(resume.insertedId)}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 ml-2"
//                 >
//                   Delete Resume
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => viewRes(sid)}
//                   // {...console.log(resume.insertedId)}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 ml-2"
//                 >
//                   View Resume
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default PostResume;

