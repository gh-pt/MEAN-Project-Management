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
exports.deleteProject = exports.updateProject = exports.addProject = exports.getProjectByOwner = exports.getProjectByName = exports.getProjectById = exports.getAllProjects = void 0;
const Project_model_1 = require("../models/Project.model");
require("dotenv/config");
// Get all projects
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield Project_model_1.Project.find()
            .populate({ path: "Owner", select: "Username" })
            .populate({
            path: "queries",
            select: "query",
            populate: { path: "replies", select: "reply" },
        });
        res.status(200).json(projects);
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to retrieve projects", error });
    }
});
exports.getAllProjects = getAllProjects;
// Get project by ID
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield Project_model_1.Project.findById(id).populate({
            path: "Owner",
            select: "Username",
        });
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.status(200).json(project);
    }
    catch (error) {
        console.error("Error fetching project by ID:", error);
        res.status(500).json({ message: "Failed to retrieve project", error });
    }
});
exports.getProjectById = getProjectById;
// Get project by name
const getProjectByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const project = yield Project_model_1.Project.findOne({ ProjectName: name }).populate({
            path: "Owner",
            select: "Username",
        });
        if (!project) {
            res.status(404).json({ message: `Project with name "${name}" not found` });
            return;
        }
        res.status(200).json([project]);
    }
    catch (error) {
        console.error("Error fetching project by name:", error);
        res.status(500).json({ message: "Failed to retrieve project by name", error });
    }
});
exports.getProjectByName = getProjectByName;
// Get all projects by owner
const getProjectByOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const projects = yield Project_model_1.Project.find({ Owner: id }).populate({
            path: "Owner",
            select: "Username",
        });
        res.status(200).json(projects);
    }
    catch (error) {
        console.error("Error fetching projects by owner:", error);
        res.status(500).json({ message: "Failed to retrieve projects by owner", error });
    }
});
exports.getProjectByOwner = getProjectByOwner;
// Add new project
const addProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProjectName, Details, DemoLink, GithubRepository, Owner } = req.body;
    try {
        const project = new Project_model_1.Project({
            ProjectName,
            Details,
            DemoLink,
            GithubRepository,
            Owner,
        });
        yield project.save();
        res.status(201).json({ message: "Project added successfully", project });
    }
    catch (error) {
        console.error("Error adding project:", error);
        res.status(500).json({ message: "Failed to add project", error });
    }
});
exports.addProject = addProject;
// Update project
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { ProjectName, Details, DemoLink, GithubRepository, Owner } = req.body;
    try {
        const project = yield Project_model_1.Project.findByIdAndUpdate(id, {
            ProjectName,
            Details,
            DemoLink,
            GithubRepository,
            Owner,
        }, { new: true });
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.status(200).json({ message: "Project updated successfully", project });
    }
    catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Failed to update project", error });
    }
});
exports.updateProject = updateProject;
// Delete project
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield Project_model_1.Project.findByIdAndDelete(id);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.status(200).json({ message: "Project deleted successfully", project });
    }
    catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: "Failed to delete project", error });
    }
});
exports.deleteProject = deleteProject;
