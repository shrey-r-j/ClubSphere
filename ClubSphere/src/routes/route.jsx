import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import StudentLayout from "./studentlayout";
import ClubHeadLayout from "./clubhead";
import TeacherLayout from "./teacher";
import Feed from "../pages/Feed";
import Clubs from "../pages/Clubs";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  { path: "/", element: <Login/> },

  {path: "/signup", element: <Signup />},

  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      { index: true, element: <Feed /> }, 
      { path: "clubs", element: <Clubs /> },
      { path: 'dashboard', element: <Dashboard/> },
    ],
  },

  {
    path: "/clubhead",
    element: <ClubHeadLayout />,
    children: [
      { index: true, element: <Feed /> },
      { path: "clubs", element: <Clubs /> },
    ],
  },

  {
    path: "/teacher",
    element: <TeacherLayout />,
    children: [
      { index: true, element: <Feed /> },
      { path: "clubs", element: <Clubs /> },
    ],
  },
]);

export default router;
