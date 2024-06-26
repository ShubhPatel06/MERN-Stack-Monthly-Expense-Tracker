import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
  } catch (err) {
    console.log(err);
    throw new Error("Cannot connect to the Database!");
  }
};
