import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CCLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app=express();

const PORT=process.env.PORT || 5000;

// console.log(process.env.MONGO_URI);

app.use(express.json());//middleware=a regular func that runs betw request and response= we are using it to parese the req.body here

app.use(express.urlencoded({extended:true}));//to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);

app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`);
  connectMongoDB();
});