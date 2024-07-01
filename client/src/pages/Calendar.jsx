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
  const [nightTimeAllowanceCount, setNightTimeAllowanceCount] = useState(0);
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

  const handleCheckboxChange = (e, type) => {
    const checked = e.target.checked;

    if (type === "morning") {
      setMorningTimeAllowanceCount((prevCount) =>
        checked ? prevCount + 1 : prevCount - 1
      );
    } else if (type === "afternoon") {
      setAfternoonTimeAllowanceCount((prevCount) =>
        checked ? prevCount + 1 : prevCount - 1
      );
    } else if (type === "night") {
      setNightTimeAllowanceCount((prevCount) =>
        checked ? prevCount + 1 : prevCount - 1
      );
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
      <button type="submit">Approval Manager</button>
      <Table dates={dates} onCheckBoxChange={handleCheckboxChange} />
      <SummaryTable
        morningTimeAllowanceCount={morningTimeAllowanceCount}
        afternoonTimeAllowanceCount={afternoonTimeAllowanceCount}
        nightTimeAllowanceCount={nightTimeAllowanceCount}
      />
    </div>
  );
};

const Table = ({ dates, onCheckBoxChange }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Morning Allowance Time</th>
          <th>Afternoon Allowance Time</th>
          <th>Night Allowance Time</th>
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
            <td>
              <input
                type="checkbox"
                onChange={(e) => onCheckBoxChange(e, "night")}
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
  afternoonTimeAllowanceCount,
  nightTimeAllowanceCount,
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
        <tr>
          <td>Night Time Allowance Count</td>
          <td>{nightTimeAllowanceCount}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default Home;
