import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import PostJob from "../Pages/PostJob";
import Signup from "../components/signup/Signup";
import Login from "../components/login/Login";
import MyJobs from "../Pages/MyJobs";
import EditJob from "../Pages/EditJob";
import JobDetails from "../Pages/JobDetails";
import About from "../Pages/About";
import AppliedUsers from "../Pages/AppliedUsers";
import AppliedJobs from "../Pages/AppliedJobs";
import PostResume from "../Pages/PostResume";
import EditGjob from "../Pages/EditGjob";
import ProtectedRoute from "../components/ProtectedRoute"; // Import the ProtectedRoute component

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home/> },
      { path: "/sign-up", element: <Signup /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      {
        path: "/post-job",
        element: <ProtectedRoute><PostJob /></ProtectedRoute>,
      },
      {
        path: "/applied-users/:id",
        element: <ProtectedRoute><AppliedUsers /></ProtectedRoute>,
      },
      {
        path: "/applied-jobs",
        element: <ProtectedRoute><AppliedJobs /></ProtectedRoute>,
      },
      {
        path: "/post-res",
        element: <ProtectedRoute><PostResume /></ProtectedRoute>,
      },
      {
        path: "/my-job",
        element: <ProtectedRoute><MyJobs /></ProtectedRoute>,
      },
      
      // Edit Job Pages (maybe require specific roles in the future)
      {
        path: "edit-job/:id",
        element: <ProtectedRoute><EditJob /></ProtectedRoute>,
        loader: ({ params }) => fetch(`http://localhost:5000/all-jobs/${params.id}`),
      },
      {
        path: "edit-gjob/:id",
        element: <ProtectedRoute><EditGjob /></ProtectedRoute>,
        loader: ({ params }) => fetch(`http://localhost:5000/all-gjobs/${params.id}`),
      },
      {
        path: "job-details/:id",
        element: <JobDetails />,
      },
    ],
  },
]);

export default routes;