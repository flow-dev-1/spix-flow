import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import logo from "@/assets/logo.png";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Flow" />
        </Link>
        <Icon icon="mdi:menu" className="d-block d-lg-none" width={30} />
      </div>
    </nav>
  );
}
