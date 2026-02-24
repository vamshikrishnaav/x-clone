import express from "express"
import { ENV } from "./config/env.js";
import cors from "cors"
import {clerkMiddleware} from '@clerk/express'
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"


const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Hello from server")
})
app.use("/api/users",userRoutes)
app.use("/api/post",postRoutes)
app.use("api/comments",commentRoutes)

//error handling middleware
app.use((err,req,res,next)=>{
  console.error("Unhandled error:",err);
  res.status(500).json({error:err.message || "internal server error"})
  
})

const startServer = async () => {
  try {
    await connectDB();

    
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();