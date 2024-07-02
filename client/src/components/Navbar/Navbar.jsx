import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { SignOutButton } from "../SignOutButton";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
const Navbar = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.log(e);
    });
  };
  const isAuthenticated = useIsAuthenticated();
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/profile">
          <button className="nav-button">View Profile</button>
        </Link>
        <Link to="/calendar">
          <button className="nav-button">Calendar</button>
        </Link>
        <Link to="/form">
          <button className="nav-button">Apply For Leave</button>
        </Link>
        <button className="nav-button">Leave History</button>
        {isAuthenticated ? (
          <SignOutButton />
        ) : (
          <button
            style={{
              backgroundColor: "#3F51B5",
              borderRadius: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => handleLogin()}
          >
            <strong>Sign in</strong>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
