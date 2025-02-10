import { Outlet } from "react-router-dom";
import NavBar from "../pages/NavBar";

const TeacherLayout = () => (
  <div>
    <NavBar />
    <Outlet />
  </div>
);

export default TeacherLayout;
