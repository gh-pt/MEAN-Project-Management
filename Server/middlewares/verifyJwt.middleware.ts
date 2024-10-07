import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from "../models/User.model";
import 'dotenv/config'
import { ObjectId } from "mongoose";

interface CustomRequest extends Request {
    user?: {
        _id: ObjectId;
    };
}

export const verifyJwt = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            res.status(401).send("Invalid credentials");
            return;
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            res.status(401).send("Invalid Access Token");
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error", error);
        res.status(401).json({ message: "Invalid or expired access token" });
    }
};
