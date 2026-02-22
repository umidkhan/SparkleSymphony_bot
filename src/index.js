require("dotenv").config();

const app = require("./core/server");
const task = require("./modules/cron");

task();
app.listen(process.env.PORT || 0, () =>
  console.log("Server started, port: ", process.env.PORT)
);
