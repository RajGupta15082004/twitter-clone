import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, { 
		maxAge: 15 * 24 * 60 * 60 * 1000, //milliseconds of 15days
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development",
	});
};

// httpOnly: true: Ensures the cookie is only accessible by the server, preventing client-side JavaScript access (mitigates XSS attacks).
// sameSite: "strict": Restricts the cookie to be sent in first-party context only, reducing the risk of CSRF attacks.
// secure: process.env.NODE_ENV !== "development": Ensures the cookie is sent over HTTPS only in production environments (NODE_ENV !== "development")