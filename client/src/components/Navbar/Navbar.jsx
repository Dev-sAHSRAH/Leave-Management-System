import React from "react";
import './Navbar.css';
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/profile"><button className="nav-button">View Profile</button></Link>
            <Link to="/calendar"><button className="nav-button">Calendar</button></Link>
            <Link to="/form"><button className="nav-button">Apply For Leave</button></Link>
            <button className="nav-button">Leave History</button>
            <button className="nav-button">Sign Out</button>
        </nav>
    );
};

export default Navbar;