import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import StudentLayout from "./studentlayout";
import ClubHeadLayout from "./clubhead";
import TeacherLayout from "./teacher";
import Feed from "../pages/Feed";
import Clubs from "../pages/Clubs";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import RoleSelection from "../pages/RoleSelection";
import ClubHeadLogin from "../pages/ClubHeadLogin";
import TeacherLogin from "../pages/TeacherLogin";
import Theme from "../pages/Theme";
import Post from "../pages/Post";
import Dashboard2 from "../pages/Dashboard2";
import Attendence from "../pages/Attendence";
import Event from "../pages/Event";

const router = createBrowserRouter([
  { path: "/", element: <RoleSelection /> },

  { path: "/student-login", element: <Login /> },
  { path: "/teacher-login", element: <TeacherLogin /> },
  { path: "/clubhead-login", element: <ClubHeadLogin /> },
  { path: "/signup", element: <Signup /> },

  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      { index: true, element: <Feed /> },
      { path: "clubs", element: <Clubs /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "theme", element: <Theme /> },
    ],
  },

  {
    path: "/clubhead",
    element: <ClubHeadLayout />,
    children: [
      { index: true, element: <Feed /> },
      { path: "clubs", element: <Clubs /> },
      { path: "theme", element: <Theme /> },
      { path: "post", element: <Post />},
      { path: "dashboard", element: <Dashboard2 /> },
      { path: "attendence", element: <Attendence/>},
      { path: "event", element: <Event/>}
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
