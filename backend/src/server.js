import express from "express"
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";



const app = express()
connectDB()

app.get('/',(req,res)=>{
res.send("Hi from server")
})
app.listen(ENV.PORT,()=>{
    console.log("server is working on localhost:",ENV.PORT);
    
})