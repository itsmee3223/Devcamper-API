const https = require("https");
const app = require("./app");
const conncetDB = require("./config/database/db.mongo");

const PORT = process.env.PORT || 8000;
const server = https.createServer(app);

const startServer = async () => {
  await conncetDB();
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
};

startServer();
