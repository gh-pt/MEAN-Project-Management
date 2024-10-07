import express from "express";
import {
  addProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectByName,
  getProjectByOwner,
  updateProject,
} from "../controllers/Project.controller";
import { verifyJwt } from "../middlewares/verifyJwt.middleware";

const router = express.Router();

router.use(verifyJwt)
// Get all Projects
router.route("/").get(getAllProjects);

// Add the Project
router.route("/add").post(addProject);

// Get Project by id
router.route("/getProjectById/:id").get(getProjectById);

// Get Project by Name
router.route("/getProjectByName/:name").get(getProjectByName);

// Get all Projects by owner
router.route("/getProjectsByOwner/:id").get(getProjectByOwner);

// Update Project
router.route("/updateProject/:id").put(updateProject);

// Delete Project
router.route("/deleteProject/:id").delete(deleteProject);

export default router;
