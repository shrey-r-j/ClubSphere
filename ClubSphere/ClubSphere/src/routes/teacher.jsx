import { Outlet } from "react-router-dom";
import NavBar from "../pages/NavBar";
import TeacherNavbar from "../pages/NavbarTeacher";

const TeacherLayout = () => (
  <div>
    <TeacherNavbar />
    <Outlet />
  </div>
);

export default TeacherLayout;
