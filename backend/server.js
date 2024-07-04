import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import {v2 as cloudinary} from "cloudinary";
import notificationRoutes from "./routes/notification.route.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CCLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app=express();

const PORT=process.env.PORT || 5000;

// console.log(process.env.MONGO_URI);

app.use(express.json());//middleware=a regular func that runs betw request and response= we are using it to parse the req.body here  // Middleware for JSON: Adds a middleware to parse incoming JSON requests. It runs between the request and response phases, enabling req.body to contain the parsed JSON.

app.use(express.urlencoded({extended:true}));//to parse form data(urlencoded)
// Middleware for URL-encoded Data: Adds a middleware to parse URL-encoded data (e.g., form submissions). The extended: true option allows for rich objects and arrays to be encoded. The extended: true option allows for rich objects and arrays to be encoded. Rich objects refer to complex data structures that include arrays and nested objects

app.use(cookieParser());
//Cookie Parser Middleware: Adds a middleware to parse cookies attached to the client request object. It makes req.cookies available for accessing cookies.

//Add all routes here
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/notifications",notificationRoutes);

app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`);
  connectMongoDB();
});