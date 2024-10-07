import { Request, Response } from "express";
import { User } from "../models/User.model";
import bcrypt from "bcryptjs"
import "dotenv/config";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

// Define a type for the JWT payload
interface JwtPayload {
    _id: string;
}

// Generate Access and Refresh Tokens
const generateTokens = (id: ObjectId) => {
    const _id = id;
    const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
};

// Options for Cookies
const cookieOptions = {
    httpOnly: true,
    secure: true,
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        console.log("request coming");
        const users = await User.find().select("-password");
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Register User
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { Username, Email, Contact, Password, ConfirmPassword, ProfileImage } = req.body;

        // check if the user exists
        const existedUser = await User.findOne({
            $or: [{ Username }, { Email }],
        });

        if (existedUser) {
            res.status(409).send("User with email or username already exists");
            return;
        }

        // Handling the uploaded ProfileImage
        let profileImageBuffer = null;
        let profileImageMimeType = null;

        // Check if a file was uploaded
        if (req.file) {
            profileImageBuffer = req.file.buffer; // Image stored in buffer format
            profileImageMimeType = req.file.mimetype; // MIME type (e.g., image/png)
        }

        // generate hashedPassword
        const hashedPassword = await bcrypt.hash(Password, 10);

        // create user
        const user = await new User({
            Username,
            Email,
            Contact,
            Password: hashedPassword,
            ConfirmPassword: hashedPassword,
            ProfileImage: {
                data: profileImageBuffer, // Store the image buffer in MongoDB
                contentType: profileImageMimeType, // Store the image MIME type
            },
        }).save();

        const RegisteredUser = {
            _id: user._id,
            Username: user.Username,
            Email: user.Email,
            Contact: user.Contact,
            ProfileImage: user.ProfileImage,
        }
        // send the response and cookies
        res
            .status(201)
            .json({
                user: RegisteredUser,
                status: "User Successfully Registered",
            });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send(error);
    }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { Email, Username, Password } = req.body;

        // check for required fields
        if (!Username && !Email) {
            res.status(400).send("Username or email is required!");
            return;
        }

        // find the user
        const user = await User.findOne({
            $or: [{ Username }, { Email }],
        });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        // Validate the password
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            res.status(400).send({ message: "Invalid credentials" });
            return;
        }

        // generate the Tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Add refreshToken to the user object without making another DB call
        user.refreshToken = refreshToken;
        await user.save();  // Save the updated refreshToken directly to the user document

        const loggedInUser = {
            _id: user._id,
            Username: user.Username,
            Email: user.Email,
            Contact: user.Contact,
            ProfileImage: user.ProfileImage,
        };

        res
            .status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
                user: loggedInUser,
                accessToken,
                refreshToken,
                status: "User Successfully loggedIn",
            });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send(error);
    }
};


// Refresh Token
export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const incomingRefreshToken =
            req.cookies?.refreshToken || req.body?.refreshToken;

        if (!incomingRefreshToken) {
            res.status(401).send("Unauthorized request");
            return;
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as JwtPayload;

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            res.status(401).send("Invalid refresh token");
            return;
        }

        if (incomingRefreshToken !== user.refreshToken) {
            res.status(401).send("Refresh token is expired or used");
            return;
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        // Add refreshToken to the user object 
        user.refreshToken = refreshToken;
        await user.save();

        res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .send({
                message: "Access Token Refreshed",
                accessToken,
                refreshToken,
            });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send(error);
    }
};

// Verify Token
export const verifyToken = async (req: Request, res: Response) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            res.status(401).send("Unauthorized request");
            return;
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            res.status(401).send("Invalid Access Token");
            return;
        }

        res.status(200).json({ message: "Valid User", User: user });
    } catch (error) {
        console.error("Error:", error);
        res.status(401).json({ message: "Invalid or expired access token" });
    }
};

// Logout User (Clear Cookies)
export const logoutUser = async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;

        // Find user by id and clear refresh token from database
        await User.updateOne(
            { _id: userId },
            { $set: { refreshToken: '' } } // Remove the refresh token from DB
        );

        // Clear cookies
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Logout failed");
    }
};