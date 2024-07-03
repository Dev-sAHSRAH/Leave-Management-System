require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const { PORT } = require("./config/server.config");
const apiRouter = require("./routes");
const { Sequelize, DataTypes } = require("sequelize");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const path = require("path");
const app = express();

const sequelize = new Sequelize("mydb", "root", "me@SQL0909", {
  dialect: "mysql",
  host: "localhost",
});

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

const getMonthName = (monthNumber) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthNumber - 1];
};

const mapColumnType = (type) => {
  switch (type.toLowerCase()) {
    case "varchar":
    case "text":
      return DataTypes.STRING;
    case "int":
    case "integer":
      return DataTypes.INTEGER;
    case "boolean":
      return DataTypes.BOOLEAN;
    case "date":
      return DataTypes.DATE;
    case "float":
      return DataTypes.FLOAT;
    case "double":
      return DataTypes.DOUBLE;
    case "decimal":
      return DataTypes.DECIMAL;
    case "datetime":
      return DataTypes.DATE;
    default:
      return DataTypes.STRING;
  }
};

const LeaveData = sequelize.define("LeaveData", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      isMicrosoftEmail(value) {
        if (!value.endsWith("@microsoft.com")) {
          throw new Error("Only Microsoft email addresses are allowed");
        }
      },
    },
  },
  from_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  to_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterFromDate(value) {
        if (new Date(value) <= new Date(this.from_date)) {
          throw new Error("To date must be after from date");
        }
      },
    },
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 255],
    },
  },
});

async function createAttendanceTable(
  monthName,
  year,
  username,
  email,
  attendance_data
) {
  const tableName = `${monthName}_${year}`;

  // Check if the table already exists
  const tableExists = await sequelize
    .getQueryInterface()
    .showAllSchemas()
    .then((tableList) => {
      return tableList.some((table) => table.tableName === tableName);
    });

  if (!tableExists) {
    // Generate the columns dynamically
    const columns = {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    };

    attendance_data.forEach((record) => {
      const columnName = `${record.date}/${record.day}`;
      columns[columnName] = {
        type: DataTypes.STRING,
        allowNull: true,
      };
    });

    const Attendance = sequelize.define(tableName, columns, {
      timestamps: false,
      freezeTableName: true,
    });

    // Sync the model with the database
    await Attendance.sync();

    const rowData = {
      username,
      email,
    };

    attendance_data.forEach((record) => {
      const columnName = `${record.date}/${record.day}`;
      rowData[columnName] = record.attendance;
    });

    const existingUser = await Attendance.findOne({ where: { email } });

    if (existingUser) {
      await existingUser.update(rowData);
    } else {
      await Attendance.create(rowData);
    }
  } else {
    console.log(`Table ${tableName} already exists.`);
  }
}

async function exportTableToCSV(tableName, filePath) {
  try {
    // Get the table description to determine columns
    const tableDesc = await sequelize
      .getQueryInterface()
      .describeTable(tableName);

    // Define the columns for the model dynamically
    const columns = {};
    for (const [columnName, columnDescription] of Object.entries(tableDesc)) {
      if (columnName === "id") {
        columns[columnName] = {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        };
      } else {
        columns[columnName] = {
          type: mapColumnType(columnDescription.type),
          allowNull: columnDescription.allowNull,
        };
      }
    }

    // Define the model
    const TableModel = sequelize.define(tableName, columns, {
      timestamps: false,
      freezeTableName: true,
    });

    // Fetch all data from the table
    const tableData = await TableModel.findAll({ raw: true });

    if (tableData.length === 0) {
      console.log(`No data found in ${tableName}`);
      return;
    }

    // Define the CSV writer
    const csvWriter = createCsvWriter({
      path: filePath,
      header: Object.keys(tableData[0]).map((key) => ({ id: key, title: key })),
    });

    // Write data to CSV file
    await csvWriter.writeRecords(tableData);

    console.log(`Data from ${tableName} exported to ${filePath}`);
  } catch (error) {
    console.error("Error exporting table to CSV:", error);
  }
}
// sequelize.sync().then(async () => {
//   try {
//     const user = await User.create({
//       name: "John Doe",
//       email: "john.doe@example.com"
//     });
//     console.log("User created:", user.toJSON());
//   } catch (error) {
//     console.error("Error creating user:", error);
//   }
// });

sequelize.sync();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.post("/api/leave", async (req, res) => {
  const { email, fromDate, toDate, yourComment } = req.body;
  try {
    await LeaveData.upsert({
      email,
      from_date: fromDate,
      to_date: toDate,
      comment: yourComment,
    });

    res.status(201).json({ message: "Leave data updated successfully" });
  } catch (error) {
    console.error("Error updating leave data:", error);
    res.status(500).json({ error: "Error updating leave data" });
  }
});

app.post("/api/test", (req, res) => {
  const {
    email,
    username,
    month,
    year,
    morningTimeAllowanceCount,
    afternoonTimeAllowanceCount,
    attendance,
  } = req.body;

  console.log("Email:", email);
  console.log("username:", username);
  console.log(month);
  const monthName = getMonthName(parseInt(month));
  console.log(year);
  console.log("Morning Time Allowance Count:", morningTimeAllowanceCount);
  console.log("Afternoon Time Allowance Count:", afternoonTimeAllowanceCount);
  const attendance_data = attendance;
  console.log("Attendance Data:", attendance_data);
  try {
    createAttendanceTable(monthName, year, username, email, attendance_data);
    const tableName = "July_2024";
    const filePath = "C:\\Users\\t-rvlnu\\Downloads\\attendance_july_2024.csv";
    exportTableToCSV(tableName, filePath);
    res.status(200).send("Attendance data received and logged.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing attendance data.");
  }
});

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set this to true on production
    },
  })
);
app.use("/api", apiRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

app.listen(PORT, () => {
  console.log(`Server listening at PORT : ${PORT}`);
});
