import mongoose, { Schema } from "mongoose";
import { QueryInterface } from "../interfaces/Query.interface";


const QuerySchema: Schema = new Schema(
  {
    projectname: { type: String, required: true },
    query: { type: String, required: true },
    replies: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" }, // user model
        reply: { type: String, required: true },
      },
    ],
    project: { type: Schema.Types.ObjectId, ref: "Project" }, // project model
    userId: { type: Schema.Types.ObjectId, ref: "User" }, // user model
  },
  { timestamps: true }
);

// Create and export the Query model
export const Query = mongoose.model<QueryInterface>("Query", QuerySchema);
