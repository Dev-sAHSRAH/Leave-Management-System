const express = require("express");
const bodyParser = require("body-parser");
const { PORT } = require("./config/server.config");
const apiRouter = require("./routes");
const app = express();

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server listening at PORT : ${PORT}`);
});
