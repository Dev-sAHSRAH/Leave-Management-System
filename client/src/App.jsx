import { Home } from "./components/Home";
import Calendar from "./pages/Calendar";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Form from "./pages/Form";
import Footer from "./components/Footer/Footer";
import { ProfileContent } from "./pages/Profile";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */

// /**
//  * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
//  */
// const MainContent = () => {
//   return (
//     <div className="App">
//       <AuthenticatedTemplate>
//         <ProfileContent />
//         <Home />
//       </AuthenticatedTemplate>

//       <UnauthenticatedTemplate>
//         <h5 className="card-title">
//           Please sign-in to see your profile information.
//         </h5>
//       </UnauthenticatedTemplate>
//     </div>
//   );
// };

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/form" element={<Form />} />
          <Route path="/profile" element={<ProfileContent />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}
