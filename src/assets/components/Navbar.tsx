import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import "../styles/global.css";
import HospLogo from "../images/HospLogo.png";

const Navbar: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar-container ${isSticky ? "sticky" : ""}`}>
      {/* Logo */}
      <NavLink to="/" className="logo">
        <img src={HospLogo} width="160" height="50" alt="Hosp_Logo" />
        <span className="logo-text">हॉस्पिटल</span>
      </NavLink>

      {/* Desktop Nav + Hamburger */}
      <div className="nav-right">
        <ul className="navbar-list">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `navbar-link ${isActive ? "active-link" : ""}`}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/registration-history"
              className={({ isActive }) => `navbar-link ${isActive ? "active-link" : ""}`}
            >
              Registration History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/our-team"
              className={({ isActive }) => `navbar-link ${isActive ? "active-link" : ""}`}
            >
              Our Team
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hospital-facilities"
              className={({ isActive }) => `navbar-link ${isActive ? "active-link" : ""}`}
            >
              Hospital Facilities
            </NavLink>
          </li>
          <li>
            <a
              href="https://wa.me/7820986647"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-link"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Hamburger for mobile */}
        {!isNavOpen && (
          <button
            className="nav-open-btn"
            onClick={() => setIsNavOpen(true)}
            aria-label="open menu"
          >
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-nav ${isNavOpen ? "active" : ""}`}>
        <div className="sidebar-bg"></div>

        <button
          className="close-btn"
          onClick={() => setIsNavOpen(false)}
          aria-label="close menu"
        >
          <IoCloseOutline size={28} color="white" />
        </button>

        <ul className="navbar-list">
          <li>
            <div className="nav-item-box">
              <NavLink
                to="/"
                className={({ isActive }) => `navbar-link ${isActive ? "active-link" : ""}`}
              >
                Home
              </NavLink>
            </div>
          </li>
          <li>
            <div className="nav-item-box">
              <NavLink
                to="/registration-history"
                className={({ isActive }) => `navbar-link ${isActive ? "active-link" : ""}`}
              >
                Registration History
              </NavLink>
            </div>
          </li>
          <li>
            <div className="nav-item-box">
              <NavLink
                to="/our-team"
                className={({ isActive }) => `navbar-link ${isActive ? "active-link" : ""}`}
              >
                Our Team
              </NavLink>
            </div>
          </li>
          <li>
            <div className="nav-item-box">
              <NavLink
                to="/hospital-facilities"
                className={({ isActive }) => `navbar-link ${isActive ? "active-link" : ""}`}
              >
                Hospital Facilities
              </NavLink>
            </div>
          </li>
          <li>
            <div className="nav-item-box">
              <a
                href="https://wa.me/7820986647"
                target="_blank"
                rel="noopener noreferrer"
                className="navbar-link"
              >
                Contact
              </a>
            </div>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      <div
        className={`overlay ${isNavOpen ? "active" : ""}`}
        onClick={() => setIsNavOpen(false)}
      ></div>
    </nav>
  );
};

export default Navbar;
