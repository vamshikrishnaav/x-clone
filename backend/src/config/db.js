import mongoose from "mongoose"
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI)
    console.log("connected to mongodb succesfully");

  } catch (error) {
    console.error("Error connecting to the dataBase:", error.message);
    process.exit(1)
  }
}