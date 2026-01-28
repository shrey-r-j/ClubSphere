import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar.jsx";

const StudentLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default StudentLayout;
