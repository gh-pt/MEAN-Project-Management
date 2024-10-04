import { ObjectId } from "mongoose";

export interface UserInterface extends Document {
  _id?: ObjectId;
  Username: string;
  Email: string;
  Contact: Number;
  Password: string;
  ConfirmPassword: string;
  ProfileImage: File;
  refreshToken: string;
}
