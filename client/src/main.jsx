import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Bootstrap components
import "bootstrap/dist/css/bootstrap.min.css";

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));

/**
 * We recommend wrapping most or all of your components in the MsalProvider component. It's best to render the MsalProvider as close to the root as possible.
 */

root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        bodyClassName="toastbody"
        theme="colored"
        transition:Bounce
      />
    </MsalProvider>
  </React.StrictMode>
);
