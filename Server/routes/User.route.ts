import express, { Request, Response } from 'express';
import { getAllUsers, loginUser, logoutUser, refreshAccessToken, registerUser, verifyToken } from '../controllers/User.controller';
import upload from '../middlewares/upload.middleware';

const router = express.Router();

// Register User
router.post('/', upload.single('ProfileImage'), registerUser);

// Get all Users
router.get('/', getAllUsers);

// Login User
router.route('/login').post(loginUser);

// Refresh Token
router.route('/refresh-token').post(refreshAccessToken);

// Verify Token
router.route('/verify-token').get(verifyToken);

// logout
router.route('/logout').post(logoutUser);
export default router;
