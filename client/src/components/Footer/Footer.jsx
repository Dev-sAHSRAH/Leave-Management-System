import React from "react";
import "./footer.css"; // Import the CSS file for styling
import { useIsAuthenticated } from "@azure/msal-react";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; Microsoft {currentYear}</p>
      </div>
    </footer>
  );
};

export default Footer;
