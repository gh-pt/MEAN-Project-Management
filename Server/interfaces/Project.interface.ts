import { ObjectId } from "mongoose";

export interface ProjectInterface extends Document {
  _id?: ObjectId;
  ProjectName: string;
  Details: string;
  DemoLink: string;
  GithubRepository: string;
  owner: ObjectId;
  queries: ObjectId[];
}
