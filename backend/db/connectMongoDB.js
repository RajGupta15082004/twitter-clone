import mongoose from 'mongoose';

const connectMongoDB=async()=>{
  try{
    const conn=await mongoose.connect(process.env.MONGO_URI);
    //mongoose.connect() returns a promise. When resolved, it returns a Mongoose connection object (conn), which represents the connection to the MongoDB database.
  }catch(error){
    console.error(`Error connection to mongodb:${error.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;