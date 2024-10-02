import mongoose, { Schema } from "mongoose";
import { QueryInterface } from "../interfaces/Query.interface";

// Define the schema
const QuerySchema: Schema = new Schema(
  {
    projectname: { type: String, required: true },
    query: { type: String, required: true },
    replies: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to the user who replied
        reply: { type: String, required: true },
      },
    ],
    project: { type: Schema.Types.ObjectId, ref: "Project" }, // Reference to the project
    userId: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to the user who created the query
  },
  { timestamps: true }
);

// Create and export the Query model
export const Query = mongoose.model<QueryInterface>("Query", QuerySchema);
