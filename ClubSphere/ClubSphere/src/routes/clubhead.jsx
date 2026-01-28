import { Outlet } from "react-router-dom";
import NavbarClub from "../pages/NavbarClub.jsx";

const ClubHeadLayout = () => (
  <div>
    <NavbarClub />
    <Outlet />
  </div>
);

export default ClubHeadLayout;
