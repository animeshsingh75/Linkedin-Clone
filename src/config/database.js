const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://animeshsingh75:8YDpNUA4TwbB34pQ@samplenode.41ejy.mongodb.net/linkedinClone"
  );
};

module.exports = connectDB;
