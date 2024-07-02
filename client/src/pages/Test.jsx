import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Test.css";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
 
const Test = () => {
  const { accounts } = useMsal();
  const [startDate, setStartDate] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selection, setSelection] = useState("");
  const [morningTimeAllowanceCount, setMorningTimeAllowanceCount] = useState(0);
  const [afternoonTimeAllowanceCount, setAfternoonTimeAllowanceCount] =
    useState(0);

  useEffect(() => {
    generateAttendanceTable(startDate);
  }, [startDate]);
 
  const generateAttendanceTable = (date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    const table = [];
 
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
 
      table.push({
        day: dayName,
        date: `${day}-${month}-${year}`,
        attendance: isWeekend ? "X" : "",
        isWeekend: isWeekend,
      });
    }
 
    setAttendance(table);
  };
 
  //   console.log("attendance", attendance);
 
  const handleRangeChange = () => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
 
    // const start = +fromDate.split("-")[2];
    // const end = +toDate.split("-")[2];
 
    if (from > to) {
      alert("From date should be earlier than To date");
      return;
    }
 
    const newAttendance = [...attendance];
    // console.log("new", newAttendance);

    const start = from.getDate();
    const end = to.getDate();

    let morningCount = 0;
    let afternoonCount = 0;
    for (let i = 0; i < newAttendance.length; i++) {
      const dateParts = newAttendance[i].date.split("-");
      const current = +dateParts[0];

      if (current >= start && current <= end && !newAttendance[i].isWeekend) {
        newAttendance[i].attendance = selection;
        if (selection === "M") {
          morningCount++;
        } else if (selection === "A") {
          afternoonCount++;
        }
      }
    }
    // for (let i = 0; i < newAttendance.length; i++) {
    //   const dateParts = newAttendance[i].date.split("-");
    //   const current = +dateParts[0];
 
    //   //   console.log(current);
 
    //   if (current >= start && current <= end && !newAttendance[i].isWeekend) {
    //     newAttendance[i].attendance = selection;
    //   }
    // }
 
    setAttendance(newAttendance);
    setMorningTimeAllowanceCount(morningCount);
    setAfternoonTimeAllowanceCount(afternoonCount);

    
  };
 
  const handleAttendanceChange = (index, value) => {
    const newAttendance = [...attendance];
    newAttendance[index].attendance = value;
    setAttendance(newAttendance);
  };
 
  const handleMonthChange = (date) => {
    setStartDate(date);
    setFromDate("");
    setToDate("");
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/test",{
        method : "POST" ,
        headers : {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          email: accounts[0].username,
          morningTimeAllowanceCount,
          afternoonTimeAllowanceCount,
          attendance 
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
      <div>
        <h5 className="profileContent">Hi, {accounts[0].name}</h5>
        <label>
          Select Month:
          <DatePicker
            selected={startDate}
            onChange={handleMonthChange}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        </label>
      </div>
      <div>
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
        <label>
          Select Attendance:
          <select
            value={selection}
            onChange={(e) => setSelection(e.target.value)}
          >
            <option value="">Select</option>
            <option value="A">Afternoon (A)</option>
            <option value="M">Morning (M)</option>
          </select>
        </label>
        <button onClick={handleRangeChange}>Update Attendance</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Date</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((entry, index) => (
            <tr key={index} className={entry.isWeekend ? "weekend" : ""}>
              <td>{entry.day}</td>
              <td>{entry.date}</td>
              <td>
                <input
                  type="text"
                  value={entry.attendance}
                  onChange={(e) =>
                    handleAttendanceChange(index, e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SummaryTable
        morningTimeAllowanceCount={morningTimeAllowanceCount}
        afternoonTimeAllowanceCount={afternoonTimeAllowanceCount}
      />
      <button onClick={handleSubmit}>Submit Attendance</button>
    </div>
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
export default Test;