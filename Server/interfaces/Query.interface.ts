import { Document, ObjectId, Types } from "mongoose";

// Define the interface for replies
interface Reply {
  user: ObjectId;
  reply: string;
}

// Define the interface for the Query model
export interface QueryInterface extends Document {
  projectname: string;
  query: string;
  replies: Reply[];
  project: ObjectId;
  userId: ObjectId;
}
