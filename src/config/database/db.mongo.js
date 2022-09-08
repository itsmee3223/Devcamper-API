const mongoose = require("mongoose");

const conncetDB = async () => {
  const connect = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  });

  console.log(`MonogDB Connected ${connect.connection.host}`);
};

module.exports = conncetDB;
