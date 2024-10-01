import { Request } from "express";
import { UserInterface } from "./User.interface";

export interface RequestWithUser extends Request {
    user: UserInterface;
}