import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login.jsx";
import StudentLayout from "./studentlayout.jsx";
import ClubHeadLayout from "./clubhead.jsx";
import TeacherLayout from "./teacher.jsx";
import Feed from "../pages/Feed.jsx";
import Clubs from "../pages/Clubs.jsx";
import Signup from "../pages/Signup.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import RoleSelection from "../pages/RoleSelection.jsx";
import ClubHeadLogin from "../pages/ClubHeadLogin.jsx";
import TeacherLogin from "../pages/TeacherLogin.jsx";
import Theme from "../pages/Theme.jsx";
import Post from "../pages/Post.jsx";
import Dashboard2 from "../pages/Dashboard2.jsx";
import Attendence from "../pages/Attendence.jsx";
import Event from "../pages/Event.jsx";
import MarkAttendence from "../pages/MarkAttendence.jsx"
import Proof from "../pages/Proof.jsx";
import TeacherAttendence from "../pages/TeacherAttendance.jsx";
import EventAttendanceDetails from "../pages/EventAttendenceDetails.jsx";
import UpcomingEvents from "../pages/UpcomingEvents.jsx";


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
      { path: 'proof', element: <Proof />},
      { path: 'upcoming-events/:clubname', element: <UpcomingEvents />}
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
      { path: "event", element: <Event/>},
      { path: "mark/:eventId", element: <MarkAttendence /> },
    ],
  },

  {
    path: "/teacher",
    element: <TeacherLayout />,
    children: [
      { index: true, element: <Feed /> },
      //{ path: "clubs", element: <Clubs /> },
      { path: "theme", element: <Theme /> },
      { path: 'attendance', element: <TeacherAttendence /> },
      { path: "event-attendance/:eventId", element: <EventAttendanceDetails /> },  
    ],
  },
]);

export default router;
