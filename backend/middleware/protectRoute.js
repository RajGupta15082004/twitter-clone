import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) { //if no token = error
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });//refer to http statuses
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);//verify the token

		if (!decoded) { // if token invalid = error
			return res.status(401).json({ error: "Unauthorized: Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");//as we dont want to return password

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;
		next();//next function is gonna call the next function getMe in auth.route.js after protectRout ( after authentication is verified )
	} catch (err) {
		console.log("Error in protectRoute middleware", err.message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};