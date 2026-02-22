const axios = require("axios");
require("dotenv").config();

const task = () => {
  setInterval(async () => {
    try {
      const response = await axios.post(process.env.WEBHOOK_URI, {
        ContentType: "application/json",
      });
      console.log(`[PING]: POST request sent, status: ${response.status}`);
    } catch (err) {
      console.error(`[ERROR] Error sending POST request: ${err.message}`);
    }
  }, 6000);
};

module.exports = task;
