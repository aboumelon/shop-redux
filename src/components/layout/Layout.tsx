import { Outlet } from "react-router-dom";

// components
import Topbar from "../topbar/Topbar";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

function Layout() {
  return (
    <>
      <Topbar />
      <Navbar />
      <Outlet />
      <a href="#" className="btn btn-primary back-to-top">
        <i className="fa fa-angle-double-up"></i>
      </a>
      <Footer />
    </>
  );
}

export default Layout;
