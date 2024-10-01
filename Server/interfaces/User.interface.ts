import { ObjectId } from "mongoose";

export interface UserInterface {
    _id?: ObjectId;
    Username: string;
    Email: string;
    Contact: Number;
    Password: string;
    ConfirmPassword: string;
    ProfileImage: string;
    refreshToken: string;
}
