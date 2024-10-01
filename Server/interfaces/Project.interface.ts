import { ObjectId } from "mongoose";

export interface ProjectInterface {
    _id?: ObjectId;
    ProjectName: string;
    Details: string;
    DemoLink: string;
    GithubRepository: string;
}