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
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,//Each element in the array is an ObjectId, which is a special type used for unique identifiers in MongoDB.
      ref: "Post",//This creates a reference to the User MODEL, indicating that each ObjectId corresponds to another user. "Post" refers to the name of the model that this field is referencing
      default: [],
    },
  ],
},{timestamps:true}//This option adds two fields to the schema: createdAt and updatedAt. These fields automatically record the creation and last update times of each document.
);

// So above we created a schema of the user

// now we will create a model below
const User=mongoose.model("User",userSchema);//users

export default User;