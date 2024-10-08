import { Document, ObjectId, } from "mongoose";


interface Reply {
  user: ObjectId;
  reply: string;
}

export interface QueryInterface extends Document {
  projectname: string;
  query: string;
  replies: Reply[];
  project: ObjectId;
  userId: ObjectId;
}
