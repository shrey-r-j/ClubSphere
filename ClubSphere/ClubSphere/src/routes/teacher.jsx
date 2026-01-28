import { Outlet } from "react-router-dom";
import TeacherNavbar from "../pages/NavbarTeacher.jsx";

const TeacherLayout = () => (
  <div>
    <TeacherNavbar />
    <Outlet />
  </div>
);

export default TeacherLayout;
