const mongoose = require("mongoose");

async function connect() {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017/challenge_db";
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
}

module.exports = { connect };