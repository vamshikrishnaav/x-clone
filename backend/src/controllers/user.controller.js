import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import { clerkClient } from "@clerk/express";

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "user not found" })

  res.status(200).json({ user })
})

// update the profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = req.auth()
  const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, { new: true })
  if (!user) return res.status(404).json({ error: "User not found" })
  res.status(200).json({ user })
})

export const syncUser = asyncHandler(async (req, res) => {
  const { userId } = req.auth();

  try {
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
      return res.status(200).json({ user: existingUser, message: "User already exists" })
    }

    // fetch user from clerk
    const clerkUser = await clerkClient.users.getUser(userId)

    if (!clerkUser) {
      return res.status(404).json({ error: "Clerk user not found" })
    }

    const email = clerkUser.emailAddresses[0].emailAddress;
    let username = clerkUser.username || email.split("@")[0];

    // Check if username is already taken in our DB
    let userWithSameUsername = await User.findOne({ username });
    if (userWithSameUsername) {
      // If taken, append a random string
      username = `${username}_${Math.floor(Math.random() * 1000)}`;
    }

    const userData = {
      clerkId: userId,
      email: email,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      username: username,
      profilePicture: clerkUser.imageUrl || ""
    }

    const user = await User.create(userData);
    console.log(`User synced successfully: ${userId}`);
    res.status(201).json({ user, message: "user created successfully" })

  } catch (error) {
    console.error("Error in syncUser:", error);

    // Handle race condition where user might have been created between findOne and create
    if (error.code === 11000) {
      const existingUser = await User.findOne({ clerkId: userId });
      if (existingUser) {
        return res.status(200).json({ user: existingUser, message: "User already exists (handled conflict)" });
      }
      return res.status(400).json({ error: "Username or email already exists" });
    }

    throw error; // Re-throw for global error handler
  }
})

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = req.auth()
  const user = await User.findOne({ clerkId: userId });

  if (!user) return res.status(404).json({ error: "User not found" })

  res.status(200).json({ user });
})

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = req.auth();
  const { targetUserId } = req.params;

  if (userId === targetUserId) return res.status(400).json({ error: "You cannot follow yourself" });

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" });

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUser._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  res.status(200).json({
    message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
  });
});