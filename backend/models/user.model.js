import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  //member since july 2020 created at
  username:{
    type:String,
    required:true,
    unique:true,
  },
  fullName:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
    minLength:6,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  followers:[
    {
      type: mongoose.Schema.Types.ObjectId,// 16 char
      ref:"User",// a follower will be a userId
      default:[]// when user sinups for firts time hhe has 0 followers
    }
  ],
  following:[
    {
      type: mongoose.Schema.Types.ObjectId,// 16 char
      ref:"User",// a follower will be a userId
      default:[]
    }
  ],
  profileImg:{
    type:String,
    default:"",
  },
  coverImg:{
    type:String,
    default:"",
  },
  bio:{
    type:String,
    default:"",
  },
  link:{
    type:String,
    default:"",
  },
},{timestamps:true}
);

// So above we created a schema of the user

// now we will create a model below
const User=mongoose.model("User",userSchema);//users

export default User;