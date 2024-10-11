import { Request, Response } from "express";
import { Query } from "../models/Query.model";
import { Project } from "../models/Project.model";
import { User } from "../models/User.model";
import { ObjectId } from "mongoose";


// Create a new query
export const addQuery = async (req: Request, res: Response) => {
    try {
        const { query, projectId, userId } = req.body;

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Create a new query
        const newQuery = new Query({
            projectname: project.ProjectName,
            query,
            replies: [],
            project: project._id,
            userId: user._id
        });

        // Save the query to the database
        const savedQuery = await newQuery.save();

        // Add the query reference to the project
        project.queries.push(savedQuery._id as ObjectId);
        await project.save();

        res.status(201).json({ message: "Query added successfully", query: savedQuery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all queries
export const getAllQueries = async (req: Request, res: Response) => {
    try {
        const queries = await Query.find()
            .populate({ path: 'project', select: 'ProjectName' })
            .populate({ path: 'replies', select: 'reply', populate: { path: 'user', select: 'Username' } });
        res.status(200).json(queries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a specific query by ID
export const getQueryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const query = await Query.findById(id)
            .populate({ path: 'project', select: 'ProjectName' })
            .populate({ path: 'replies', select: 'reply', populate: { path: 'user', select: 'Username' } });
        if (!query) {
            res.status(404).json({ message: "Query not found" });
            return;
        }
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update a query
export const updateQuery = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { query } = req.body;

        // Find the query and update
        const updatedQuery = await Query.findByIdAndUpdate(
            id,
            { query },
            { new: true }
        ).populate({ path: 'project', select: 'ProjectName' })
            .populate({ path: 'replies', select: 'reply', populate: { path: 'user', select: 'Username' } });

        if (!updatedQuery) {
            res.status(404).json({ message: "Query not found" });
            return;
        }

        res.status(200).json({ message: "Query updated successfully", query: updatedQuery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a query
export const deleteQuery = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const query = await Query.findById(id);
        if (!query) {
            res.status(404).json({ message: "Query not found" });
            return;
        }

        // Remove the query from the project
        await Project.findByIdAndUpdate(query.project, {
            $pull: { queries: query._id }
        });

        // Delete the query
        await query.deleteOne({ _id: query._id });

        res.status(200).json({ message: "Query deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Add a reply to a query
export const addReplyToQuery = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reply, userId } = req.body;

        // Find the query
        const query = await Query.findById(id);
        if (!query) {
            res.status(404).json({ message: "Query not found" });
            return;
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Add the reply
        query.replies.push({ user: user._id, reply });
        await query.save();

        res.status(200).json({ message: "Reply added successfully", query });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// Get All queries to a project
export const getQueriesByProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const queries = await Query.find({ project: id })
            .populate({ path: 'project', select: 'ProjectName' })
            .populate({ path: 'replies', select: 'reply', populate: { path: 'user', select: 'Username' } })
            .populate({ path: 'userId', select: 'Username' });
        res.status(200).json(queries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}