import mongoose, { Schema } from "mongoose";
import { ProjectInterface } from "../interfaces/Project.interface";


const ProjectSchema: Schema = new Schema(
    {
        "ProjectName": { type: String, required: true },
        "Details": { type: String, required: true },
        "DemoLink": { type: String, required: true },
        "GithubRepository": { type: String, required: true },
        "Owner": { type: Schema.Types.ObjectId, ref: "User" },
        "queries": [{ type: Schema.Types.ObjectId, ref: "Query" }]
    },
    { timestamps: true }
);


export const Project = mongoose.model<ProjectInterface>("Project", ProjectSchema);