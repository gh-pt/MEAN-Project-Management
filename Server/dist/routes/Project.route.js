"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Project_controller_1 = require("../controllers/Project.controller");
const router = express_1.default.Router();
// Get all Projects
router.route("/").get(Project_controller_1.getAllProjects);
// Add the Project
router.route("/add").post(Project_controller_1.addProject);
// Get Project by id
router.route("/getProjectById/:id").get(Project_controller_1.getProjectById);
// Get Project by Name
router.route("/getProjectByName/:name").get(Project_controller_1.getProjectByName);
// Get all Projects by owner
router.route("/getProjectsByOwner/:id").get(Project_controller_1.getProjectByOwner);
// Update Project
router.route("/updateProject/:id").put(Project_controller_1.updateProject);
// Delete Project
router.route("/deleteProject/:id").delete(Project_controller_1.deleteProject);
exports.default = router;
