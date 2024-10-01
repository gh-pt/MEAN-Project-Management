import express, { Request, Response } from 'express';
import { getAllUsers, loginUser, refreshAccessToken, registerUser, verifyToken } from '../controllers/User.controller';

const router = express.Router();

// Register User
router.post('/', registerUser);

// Get all Users
router.get('/', getAllUsers);

// Login User
router.route('/login').post(loginUser);

// Refresh Token
router.route('/refresh-token').post(refreshAccessToken);

// Verify Token
router.route('/verify-token').get(verifyToken);

export default router;
