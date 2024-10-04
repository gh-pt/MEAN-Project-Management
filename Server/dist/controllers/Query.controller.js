"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueriesByProject = exports.addReplyToQuery = exports.deleteQuery = exports.updateQuery = exports.getQueryById = exports.getAllQueries = exports.addQuery = void 0;
const Query_model_1 = require("../models/Query.model");
const Project_model_1 = require("../models/Project.model");
const User_model_1 = require("../models/User.model");
// Create a new query
const addQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, projectId, userId } = req.body;
        // Find the project
        const project = yield Project_model_1.Project.findById(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        // Find the user
        const user = yield User_model_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Create a new query
        const newQuery = new Query_model_1.Query({
            projectname: project.ProjectName, // Set projectname to the ProjectName field of the found project
            query,
            replies: [],
            project: project._id,
            userId: user._id
        });
        // Save the query to the database
        const savedQuery = yield newQuery.save();
        // Add the query reference to the project
        project.queries.push(savedQuery._id);
        yield project.save();
        res.status(201).json({ message: "Query added successfully", query: savedQuery });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.addQuery = addQuery;
// Get all queries
const getAllQueries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queries = yield Query_model_1.Query.find()
            .populate({ path: 'project', select: 'ProjectName' })
            .populate({ path: 'replies', select: 'reply', populate: { path: 'user', select: 'Username' } });
        res.status(200).json(queries);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAllQueries = getAllQueries;
// Get a specific query by ID
const getQueryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const query = yield Query_model_1.Query.findById(id)
            .populate({ path: 'project', select: 'ProjectName' })
            .populate({ path: 'replies', select: 'reply', populate: { path: 'user', select: 'Username' } });
        if (!query) {
            res.status(404).json({ message: "Query not found" });
            return;
        }
        res.status(200).json(query);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getQueryById = getQueryById;
// Update a query
const updateQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { query } = req.body;
        // Find the query and update
        const updatedQuery = yield Query_model_1.Query.findByIdAndUpdate(id, { query }, { new: true }).populate({ path: 'project', select: 'ProjectName' })
            .populate({ path: 'replies', select: 'reply', populate: { path: 'user', select: 'Username' } });
        if (!updatedQuery) {
            res.status(404).json({ message: "Query not found" });
            return;
        }
        res.status(200).json({ message: "Query updated successfully", query: updatedQuery });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateQuery = updateQuery;
// Delete a query
const deleteQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const query = yield Query_model_1.Query.findById(id);
        if (!query) {
            res.status(404).json({ message: "Query not found" });
            return;
        }
        // Remove the query from the project
        yield Project_model_1.Project.findByIdAndUpdate(query.project, {
            $pull: { queries: query._id }
        });
        // Delete the query
        yield query.deleteOne({ _id: query._id });
        res.status(200).json({ message: "Query deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteQuery = deleteQuery;
// Add a reply to a query
const addReplyToQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { reply, userId } = req.body;
        // Find the query
        const query = yield Query_model_1.Query.findById(id);
        if (!query) {
            res.status(404).json({ message: "Query not found" });
            return;
        }
        // Find the user
        const user = yield User_model_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Add the reply
        query.replies.push({ user: user._id, reply });
        yield query.save();
        res.status(200).json({ message: "Reply added successfully", query });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.addReplyToQuery = addReplyToQuery;
// Get All queries to a project
const getQueriesByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const queries = yield Query_model_1.Query.find({ project: id })
            .populate({ path: 'project', select: 'ProjectName' })
            .populate({ path: 'replies', select: 'reply', populate: { path: 'user', select: 'Username' } })
            .populate({ path: 'userId', select: 'Username' });
        res.status(200).json(queries);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getQueriesByProject = getQueriesByProject;
