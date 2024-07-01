import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./form.css"; // Import the CSS file for styling

const Form = () => {
  // State to manage form fields
  const [yourComment, setYourComment] = useState("");
  const status = "pending"; // Status is pending by default
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call, etc.)
    console.log({ yourComment, status }); // Temporary: Log form data to console
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/calendar"); // Navigate to '/calendar' when cancel button is clicked
  };

  return (
    <div className="leave-application-container">
      <form className="leave-application-form" onSubmit={handleSubmit}>
        <h2>Leave Application</h2>
        <div className="form-group">
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
