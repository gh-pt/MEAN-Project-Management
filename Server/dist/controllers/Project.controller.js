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
// Get the All Projects
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield Project_model_1.Project.find().populate({
            path: "Owner",
            select: "Username",
        }).populate({
            path: "queries",
            select: "query",
            populate: {
                path: "replies",
                select: "reply",
            },
        });
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getAllProjects = getAllProjects;
// Get the Project by ID
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield Project_model_1.Project.findById(id).populate({
            path: "Owner",
            select: "Username",
        });
        res.status(200).json(project);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getProjectById = getProjectById;
// get the project by name
const getProjectByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const project = yield Project_model_1.Project.findOne({ ProjectName: name })
            .populate({
            path: "Owner",
            select: "Username",
        });
        res.status(200).json([project]);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getProjectByName = getProjectByName;
// get the all project by owner
const getProjectByOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield Project_model_1.Project.find({ Owner: id })
            .populate({
            path: "Owner",
            select: "Username",
        });
        res.status(200).send(project);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getProjectByOwner = getProjectByOwner;
// add project
const addProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProjectName, Details, DemoLink, GithubRepository, Owner } = req.body;
    try {
        const project = new Project_model_1.Project({
            ProjectName,
            Details,
            DemoLink,
            GithubRepository,
            Owner
        });
        yield project.save();
        res.status(200).json({ message: "Project Added", project });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.addProject = addProject;
// update project
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
        res.status(200).json({ message: "Project Updated", project });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.updateProject = updateProject;
// delete project
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield Project_model_1.Project.findByIdAndDelete(id);
        res.status(200).json({ message: "Project Deleted", project });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.deleteProject = deleteProject;
