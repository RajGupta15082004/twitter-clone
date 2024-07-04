import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

//models
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
	const { username } = req.params;
	//When defining routes in an Express application, you can specify parameters in the URL by using a colon (:) followed by the parameter name.
	// For example, if your route is defined as /users/:username, then :username is a route parameter.
	// When a request is made to /users/johndoe, req.params will be an object like { username: 'johndoe' }.
	//same as const username = req.params.username; // username is now 'johndoe'

	try {
		const user = await User.findOne({ username }).select("-password");
		if (!user) return res.status(404).json({ message: "User not found" });

		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getUserProfile: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);//req.user = from protectRoutes ._id is convention to fetch id

		if (id === req.user._id.toString()) {//cant compare string to objectId type so first compare
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);//.includes() returns a boolean value
    //push and pull are two methods of mongoose to remove or add to the array
		if (isFollowing) {
			// Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });//followers,following from model
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });//this is updated by itself in db so no need to do .save()
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			// Send notification to the user
			const newNotification = new Notification({//notification model
				type: "follow",
				from: req.user._id,
				to: userToModify._id,//can be written in any order
			});

			await newNotification.save();//save the notification to the database

			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (error) {
		console.log("Error in followUnfollowUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id;//string value
		
		//includes curr user's id and a list of their followings whom they follow
		const usersFollowedByMe = await User.findById(userId).select("following");//following from model;it is an object
    
		//Uses MongoDB's aggregation framework to get a random sample of 10 users who are not the current user ($ne: userId).
		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		// 1,2,3,4,5,6,
    // Filters out users from the sampled users who are already followed by the current user and the user itself.
		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));

		const suggestedUsers = filteredUsers.slice(0, 4);
		//Takes the first 4 users from the filtered list of users to create a list of suggested users.

		suggestedUsers.forEach((user) => (user.password = null));//Iterates over the list of suggested users and sets their password field to null to ensure it is not included in the response.

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Error in getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const updateUser = async (req, res) => {
	const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
	//These variables (fullName, email, username, etc.) originate from user input or data submitted by the client application.
	// For example, if this code is part of a form submission in a web application, req.body might contain data entered by the user into input fields (like fullName, email, etc.).
	let { profileImg, coverImg } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}
      //hashing
			const salt = await bcrypt.genSalt(10);//The rounds parameter (in this case, 10) determines the complexity of the hashing algorithm by specifying the number of iterations to generate the salt.
			// More rounds increase the computational cost for an attacker trying to brute-force the hashed password.
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImg) {
      //if image already exisits
			if (user.profileImg) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
        //upar wale string ko pehle / se split karo fir pop se last wala elem milega fir usko . se split karo and get the first part
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
      //if image already exisits
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			// Example uploadedResponse structure
			// {
			//   public_id: 'sample_id',
			//   secure_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
			//   format: 'jpg',
			//   created_at: '2024-07-04T12:00:00Z',
			//   bytes: 1024
			// }
			coverImg = uploadedResponse.secure_url;
		}
  
    //update to database too
		user.fullName = fullName || user.fullName;//either update if update is done or earlier one
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();//saving to dsatabase

		// password should be null in response
		user.password = null;
    //this will not change database as we are not doing await user.save() after this

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};