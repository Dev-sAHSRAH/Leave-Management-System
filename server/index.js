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
const { Sequelize, DataTypes} = require("sequelize");
const app = express();


const sequelize = new Sequelize("pro1","root","Vaish@123",
  {
    dialect : "mysql",
    host:"localhost"
  }
);

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
});

const AttendanceData = sequelize.define("attendance_data",
{
  email : {
    type : DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      isMicrosoftEmail(value) {
        if (!value.endsWith('@microsoft.com')) {
          throw new Error('Only Microsoft email addresses are allowed');
    }
  }}},
  morning_count : {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  afternoon_count : {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

const LeaveData = sequelize.define("LeaveData",{
  email : {
    type : DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      isMicrosoftEmail(value) {
        if (!value.endsWith('@microsoft.com')) {
          throw new Error('Only Microsoft email addresses are allowed');
    }
  }}},
  from_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  to_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterFromDate(value) {
        if (new Date(value) <= new Date(this.from_date)) {
          throw new Error('To date must be after from date');
        }
      }
    }
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 255] // Set a length limit if needed
    }
  }
})

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

// app.post("/users/:name/:email", async (req, res) => {
//   const { name, email } = req.params;

//   try {
//     const user = await User.create({ name, email });
//     res.status(201).json(user);
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ error: "Error creating user" });
//   }
// });

app.post("/api/attendance", async (req, res) => {
  const { email, morningTimeAllowanceCount, afternoonTimeAllowanceCount } = req.body;

  try 
  {
    await AttendanceData.upsert({
      email,
      morning_count: morningTimeAllowanceCount,
      afternoon_count: afternoonTimeAllowanceCount,
    });

    res.status(201).json({ message: "Attendance data updated successfully" });
  } 
  catch (error) 
  {
    console.error("Error updating attendance data:", error);
    res.status(500).json({ error: "Error updating attendance data" });
  }
});

app.post("/api/leave",async(req,res) => {
  const {email , fromDate , toDate , yourComment} = req.body;
  try 
  {
    await LeaveData.upsert({
      email,
      from_date : fromDate,
      to_date : toDate,
      comment : yourComment
    });

    res.status(201).json({ message: "Leave data updated successfully" });
  } 
  catch (error) 
  {
    console.error("Error updating leave data:", error);
    res.status(500).json({ error: "Error updating leave data" });
  }

});

app.post("/api/test", (req, res) => {
  const { email, morningTimeAllowanceCount, afternoonTimeAllowanceCount, attendance } = req.body;

  // Log the received data to the console
  console.log("Email:", email);
  console.log("Morning Time Allowance Count:", morningTimeAllowanceCount);
  console.log("Afternoon Time Allowance Count:", afternoonTimeAllowanceCount);
  console.log("Attendance Data:", attendance);

  // Send a response back to the client
  res.status(200).send("Attendance data received and logged.");
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
