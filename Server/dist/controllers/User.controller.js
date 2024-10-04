"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.refreshAccessToken = exports.loginUser = exports.registerUser = exports.getAllUsers = void 0;
const User_model_1 = require("../models/User.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate Access and Refresh Tokens
const generateTokens = (id) => {
    const _id = id;
    const accessToken = jsonwebtoken_1.default.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, {
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
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("request coming");
        const users = yield User_model_1.User.find().select("-password");
        res.status(200).send(users);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getAllUsers = getAllUsers;
// Register User
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Username, Email, Contact, Password, ConfirmPassword, ProfileImage } = req.body;
        // check if the user exists
        const existedUser = yield User_model_1.User.findOne({
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
        const hashedPassword = yield bcryptjs_1.default.hash(Password, 10);
        // create user
        const user = yield new User_model_1.User({
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
        // Generate the accessToken and refreshToken
        const { accessToken, refreshToken } = generateTokens(user._id);
        yield User_model_1.User.updateOne({ _id: user._id }, {
            $set: {
                refreshToken
            }
        });
        const RegisteredUser = yield User_model_1.User.findById(user._id).select("-Password -ConfirmPassword -refreshToken");
        // send the response and cookies
        res
            .status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
            user: RegisteredUser,
            accessToken,
            refreshToken,
            status: "User Successfully Registered",
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send(error);
    }
});
exports.registerUser = registerUser;
// Login User
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Email, Username, Password } = req.body;
        // check for required fields
        if (!Username && !Email) {
            res.status(400).send("Username or email is required!");
            return;
        }
        // find the user
        const user = yield User_model_1.User.findOne({
            $or: [{ Username }, { Email }],
        });
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        // Validate the password
        const isMatch = yield bcryptjs_1.default.compare(Password, user.Password);
        if (!isMatch) {
            res.status(400).send({ message: "Invalid credentials" });
            return;
        }
        // generate the Tokens
        const { accessToken, refreshToken } = generateTokens(user._id);
        yield User_model_1.User.updateOne({ _id: user._id }, {
            $set: {
                refreshToken
            }
        });
        const loggedInUser = yield User_model_1.User.findById(user._id).select("-Password -ConfirmPassword -refreshToken");
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
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send(error);
    }
});
exports.loginUser = loginUser;
// Refresh Token
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const incomingRefreshToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) || ((_b = req.body) === null || _b === void 0 ? void 0 : _b.refreshToken);
        if (!incomingRefreshToken) {
            res.status(401).send("Unauthorized request");
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = yield User_model_1.User.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id);
        if (!user) {
            res.status(401).send("Invalid refresh token");
            return;
        }
        if (incomingRefreshToken !== user.refreshToken) {
            res.status(401).send("Refresh token is expired or used");
            return;
        }
        const { accessToken, refreshToken } = generateTokens(user._id);
        yield User_model_1.User.updateOne({ _id: user._id }, {
            $set: {
                refreshToken
            }
        });
        res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .send({
            message: "Access Token Refreshed",
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send(error);
    }
});
exports.refreshAccessToken = refreshAccessToken;
// Verify Token
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
            ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
        if (!token) {
            res.status(401).send("Unauthorized request");
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = yield User_model_1.User.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id).select("-password -refreshToken");
        if (!user) {
            res.status(401).send("Invalid Access Token");
            return;
        }
        res.status(200).json({ message: "Valid User", User: user });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(401).json({ message: "Invalid or expired access token" });
    }
});
exports.verifyToken = verifyToken;
