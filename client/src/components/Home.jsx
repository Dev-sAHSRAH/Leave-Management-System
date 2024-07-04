import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { SignInButton } from "./SignInButton";

/**
 * Renders the sign-in page with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
export const Home = (props) => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const redirectToCalendar = () => {
    navigate("/calendar");
  };

  return (
    <div
      style={{
        backgroundColor: "#1A237E",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          border: "1px solid #ABCEF0",
          padding: "20px",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#FFFFFF" }}>Sign In</h2>
        <p style={{ color: "#FFFFFF" }}>
          Sign in with your Microsoft account to access your account.
        </p>
        {isAuthenticated ? redirectToCalendar() : <SignInButton />}
      </div>
    </div>
  );
};
