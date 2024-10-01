import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.model";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from "../interfaces/RequestWithUser.interface";

interface DecodedToken {
    _id: string;
}

export const verifyJwt = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            res.status(401).send("Invalid credentials");
            return;
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as DecodedToken;

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            res.status(401).send("Invalid Access Token");
            return;
        }

        // Add the user to the request object for use in other middleware or routes
        req.user = user;
        next();
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "Invalid or expired access token" });
    }
};
