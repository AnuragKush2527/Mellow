import mongoose from "mongoose";

const connectDB = async () => {
  const mongo_url = process.env.MONGO_CONN;
  mongoose
    .connect(mongo_url)
    .then(() => {
      console.log("MongoDB Connected successfully.");
    })
    .catch((err) => {
      console.log("MongoDB Connection Error: ", err);
    });
};

export default connectDB;
