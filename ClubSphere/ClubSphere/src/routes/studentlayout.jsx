import { Outlet } from "react-router-dom";
import Navbar from "../pages/NavBar";

const StudentLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default StudentLayout;
