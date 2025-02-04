import { Outlet } from "react-router-dom";
import NavBar from "../pages/NavBar";

const ClubHeadLayout = () => (
  <div>
    <NavBar />
    <Outlet />
  </div>
);

export default ClubHeadLayout;
