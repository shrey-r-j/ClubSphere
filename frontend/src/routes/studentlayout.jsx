import { Outlet } from "react-router-dom";
import NavBar from "../pages/NavBar";

const StudentLayout = () => (
  <div>
    <NavBar />
    <Outlet /> 
  </div>
);

export default StudentLayout;
