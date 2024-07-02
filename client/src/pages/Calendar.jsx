import React, { useState, useEffect } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./calendar.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { accounts } = useMsal();
  const [startDate, setStartDate] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [morningTimeAllowanceCount, setMorningTimeAllowanceCount] = useState(0);
  const [afternoonTimeAllowanceCount, setAfternoonTimeAllowanceCount] =
    useState(0);

  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/");
  }

  useEffect(() => {
    generateDates(new Date());
  }, []);


  const handleMonthChange = (date) => {
    console.log("Selected date:", date);
    setStartDate(date);
    generateDates(date);
    setShowDatePicker(false);
    uncheckAllCheckboxes();
    setMorningTimeAllowanceCount(0);
    setAfternoonTimeAllowanceCount(0);
  };

  const generateDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const newDates = [];

    for (let i = 1; i <= daysInMonth; i++) {
      newDates.push(new Date(year, month, i));
    }

    setDates(newDates);
  };

  const uncheckAllCheckboxes = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  };
  const handleCheckboxChange = (e, type , date) => {
    const checked = e.target.checked;

    if (type === "morning") {
      setMorningTimeAllowanceCount((prevCount) =>
        checked ? prevCount + 1 : prevCount - 1
      );
    } else if (type === "afternoon") {
      setAfternoonTimeAllowanceCount((prevCount) =>
        checked ? prevCount + 1 : prevCount - 1
      );
    } 
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/attendance",{
        method : "POST" ,
        headers : {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          email: accounts[0].username,
          morningTimeAllowanceCount,
          afternoonTimeAllowanceCount
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit attendance data");
      }

      console.log("Attendance data submitted successfully");
    }
    catch(err)
    {
      console.error("Error submitting attendance data:",err);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <h5 className="profileContent">Hi, {accounts[0].name}</h5>
      ) : null}
      <button type="submit" onClick={() => setShowDatePicker(!showDatePicker)}>
        {" "}
        Select period
      </button>
      {showDatePicker && (
        <DatePicker
          selected={startDate}
          onChange={handleMonthChange}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          inline
        />
      )}
      <button type="submit" onClick={handleSubmit}>Submit</button>
      <Table dates={dates} onCheckBoxChange={handleCheckboxChange} />
      <SummaryTable
        morningTimeAllowanceCount={morningTimeAllowanceCount}
        afternoonTimeAllowanceCount={afternoonTimeAllowanceCount}
      />
    </div>
  );
};

const Table = ({ dates, onCheckBoxChange, checkedStatus}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Morning Allowance Time</th>
          <th>Afternoon Allowance Time</th>
        </tr>
      </thead>
      <tbody>
        {dates.map((date, index) => (
          <tr key={index}>
            <td>{date.toLocaleDateString()}</td>
            <td>
              <input
                type="checkbox"
                onChange={(e) => onCheckBoxChange(e, "morning")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                onChange={(e) => onCheckBoxChange(e, "afternoon")}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const SummaryTable = ({
  morningTimeAllowanceCount,
  afternoonTimeAllowanceCount
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan="2">Work hours Summary</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Morning Time Allowance Count</td>
          <td>{morningTimeAllowanceCount}</td>
        </tr>
        <tr>
          <td>Afternoon Time Allowance Count</td>
          <td>{afternoonTimeAllowanceCount}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default Home;
