import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app=express();
const PORT=process.env.PORT || 5000;

// console.log(process.env.MONGO_URI);

app.use(express.json());//middleware=a regular func that runs betw request and response= we are using it to parese the req.body here

app.use(express.urlencoded({extended:true}));//to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth",authRoutes);


app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`);
  connectMongoDB();
});