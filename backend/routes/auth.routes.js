import express from "express";
import {getMe,signup,login,logout} from "../controllers/auth.controller.js"; 
const router=express.Router();
import { protectRoute } from "../middleware/protectRoute.js";

//protectRoute is a middleware
router.get("/me",protectRoute,getMe);

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

export default router;