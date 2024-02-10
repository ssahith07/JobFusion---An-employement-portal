// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const AppliedUsers = () => {
//   const { id } = useParams();
//   const [appliedUsers, setAppliedUsers] = useState([]);

//   useEffect(() => {
//     const fetchAppliedUsers = async () => {
//       console.log(id);
//       try {
//         const response = await fetch(
//           `http://localhost:5000/applied-users/${id}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch applied users");
//         }
//         const data = await response.json();
//         setAppliedUsers(data);
//       } catch (error) {
//         console.error("Error fetching applied users:", error.message);
//       }
//     };

//     fetchAppliedUsers();
//   }, [id]);
//   const viewRes = async (id) => {
//     try {
//       console.log(id)
//       window.open(`http://localhost:5000/view-resume/${id}`, "_blank");
//     } catch (error) {
//       console.error("Error getting the resume: ", error);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-xl">Applied Users</h1>
//       <div>
//         {appliedUsers.map((user) => (
//           <div key={user._id}>
//             <h2>Name: {user.fullName}</h2>
//             <p>Email: {user.email}</p>
//             <p>Number: {user.number}</p>
//             <p>Description: {user.description}</p>
//             <button type="button" onClick={() => viewRes(user.seekerId)}>
//               View Resume
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AppliedUsers;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AppliedUsers = () => {
  const { id } = useParams();
  const [appliedUsers, setAppliedUsers] = useState([]);
  const [accept, setAccept] = useState([]);
  const [reject, setReject] = useState([]);
  const [short, setShort] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchAppliedUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/applied-users/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch applied users");
        }
        const data = await response.json();
        setAppliedUsers(data);
      } catch (error) {
        console.error("Error fetching applied users:", error.message);
      }
    };

    fetchAppliedUsers();
  }, [id]);

  const viewRes = async (id) => {
    try {
      window.open(`http://localhost:5000/view-resume/${id}`, "_blank");
    } catch (error) {
      console.error("Error getting the resume: ", error);
    }
  };

  // const accRej = (seekerId) =>{
  //   fetch(`http://localhost:5000/acc/${id}`, {
  //     method:"POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ seekerId }),
  //   })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //   })
  //   .then((data) => {
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });
  // }

  const acceptJob = (seekerId) => {
    const token = localStorage.getItem("token");
  
    fetch(`http://localhost:5000/acc/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "accept", seekerId }), // Sending action as "accept"
    })
      .then((res) => res.json())
      .then((data) => console.log("Accepted:", data))
      .catch((error) => console.error("Error accepting job:", error));
  };
  
  // Similarly, a function to handle rejecting a job
  const rejectJob = (seekerId) => {
    const token = localStorage.getItem("token");
  
    fetch(`http://localhost:5000/acc/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "reject", seekerId }), // Sending action as "reject"
    })
      .then((res) => res.json())
      .then((data) => console.log("Rejected:", data))
      .catch((error) => console.error("Error rejecting job:", error));
  };

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
        setAccept(data.accepted || []);
        setReject(data.rejected || []);
      });
  }, []);
  const {accepted,rejected} = short;
  const ac = accept.includes(appliedUsers.seekerId)
  const re = reject.includes(appliedUsers.seekerId);
  console.log(ac)
  console.log(re)

  return (
    <div className="container px-4 py-4 mx-auto my-8">
      <h1 className="text-2xl font mb-6">Applied Users</h1>
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Number</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
            <th className="py-2 px-4 border-b text-left">Resume</th>
            <th className="py-2 px-4 border-b text-left">Shortlist</th>
          </tr>
        </thead>
        <tbody>
          {appliedUsers.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-gray-100 transition duration-300"
            >
              <td className="py-2 px-4 border-b">{user.fullName}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.number}</td>
              <td className="py-2 px-4 border-b">{user.description}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-blue text-white py-1 px-2 rounded hover:bg-blue-600"
                  onClick={() => viewRes(user.seekerId)}
                >
                  View Resume
                </button>
              </td>
              {!(ac || re) ? (<td className="py-2 px-4 space-x-4 border-b">
                <button className="bg-green text-white py-1 px-2 rounded hover:bg-white hover:text-green" onClick={()=>acceptJob(user.seekerId)} >
                  Accept
                </button>
                <button className="bg-red-500 text-white py-1 px-2 rounded hover:bg-white hover:text-red-500" onClick={()=>rejectJob(user.seekerId)}>
                  Reject
                </button>
              </td>) : ac ? (<button className="bg-green text-white py-1 px-2 rounded hover:bg-white hover:text-green">
                  Accepted
                </button>) : (<button className="bg-red-500 text-white py-1 px-2 rounded hover:bg-white hover:text-green">
                  Rejected
                </button>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedUsers;
