const fs = require("fs");
const path = require("path");

const conncetDB = require("./config/database/db.mongo");
require("dotenv").config({ path: path.join(__dirname, "./config/.env") });

const Bootcamp = require("./models/Bootcamp.schema");

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const importData = async () => {
  try {
    await conncetDB();
    await Bootcamp.create(bootcamps);
    console.info("Data imported....");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

const deleteData = async () => {
  try {
    await conncetDB();
    await Bootcamp.deleteMany();
    console.info("Data deleted....");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-d") return deleteData();

importData();
