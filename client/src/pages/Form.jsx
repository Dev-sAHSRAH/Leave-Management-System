import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./form.css"; // Import the CSS file for styling
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

const Form = () => {
  // State to manage form fields
  const [yourComment, setYourComment] = useState("");
  const status = "pending"; // Status is pending by default
  const navigate = useNavigate(); // useNavigate hook for navigation
  const { accounts } = useMsal();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Handle form submission
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle form submission logic here (e.g., API call, etc.)
  //   console.log({ yourComment, status }); // Temporary: Log form data to console
  // };
 
    const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/leave",{
        method : "POST" ,
        headers : {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          email: accounts[0].username,
          fromDate: new Date(fromDate).toISOString(),
          toDate: new Date(toDate).toISOString(),
          yourComment
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit leave data");
      }

      console.log("Attendance data submitted successfully");
    }
    catch(err)
    {
      console.error("Error submitting attendance data:",err);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/calendar"); // Navigate to '/calendar' when cancel button is clicked
  };

  return (
    <div className="leave-application-container">
      <form className="leave-application-form" onSubmit={handleSubmit}>
        <h5 className="profileContent">Hi, {accounts[0].name}</h5>
        <h2>Leave Application</h2>
        <div className="form-group">
        <label>
          From Date:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          To Date:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
          <label htmlFor="yourComment">Your Comment:</label>
          <textarea
            id="yourComment"
            name="yourComment"
            value={yourComment}
            onChange={(e) => setYourComment(e.target.value)}
            rows="4"
            className="resizable-textarea"
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit">Submit</button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
