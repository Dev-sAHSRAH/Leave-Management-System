import React from "react";
import { useMsal } from "@azure/msal-react";

export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/",
    });
  };

  return (
    <button
      onClick={() => handleLogout()}
      style={{
        backgroundColor: "#b34d36",
        borderRadius: "5px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <strong> Sign out</strong>
    </button>
  );
};
