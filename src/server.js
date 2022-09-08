const http = require("http");
const app = require("./app");
const conncetDB = require("./config/database/db.mongo");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const startServer = async () => {
  await conncetDB();
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
};

startServer();
