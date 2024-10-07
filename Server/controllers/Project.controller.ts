import { Request, Response } from "express";
import { Project } from "../models/Project.model";
import "dotenv/config";

// Get all projects
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .populate({ path: "Owner", select: "Username" })
      .populate({
        path: "queries",
        select: "query",
        populate: { path: "replies", select: "reply" },
      });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to retrieve projects", error });
  }
};

// Get project by ID
export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id).populate({
      path: "Owner",
      select: "Username",
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ message: "Failed to retrieve project", error });
  }
};

// Get project by name
export const getProjectByName = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const project = await Project.findOne({ ProjectName: name }).populate({
      path: "Owner",
      select: "Username",
    });

    if (!project) {
      res.status(404).json({ message: `Project with name "${name}" not found` });
      return;
    }

    res.status(200).json([project]);
  } catch (error) {
    console.error("Error fetching project by name:", error);
    res.status(500).json({ message: "Failed to retrieve project by name", error });
  }
};

// Get all projects by owner
export const getProjectByOwner = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const projects = await Project.find({ Owner: id }).populate({
      path: "Owner",
      select: "Username",
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects by owner:", error);
    res.status(500).json({ message: "Failed to retrieve projects by owner", error });
  }
};

// Add new project
export const addProject = async (req: Request, res: Response) => {
  const { ProjectName, Details, DemoLink, GithubRepository, Owner } = req.body;
  try {
    const project = new Project({
      ProjectName,
      Details,
      DemoLink,
      GithubRepository,
      Owner,
    });

    await project.save();
    res.status(201).json({ message: "Project added successfully", project });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ message: "Failed to add project", error });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ProjectName, Details, DemoLink, GithubRepository, Owner } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      id,
      {
        ProjectName,
        Details,
        DemoLink,
        GithubRepository,
        Owner,
      },
      { new: true }
    );

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Failed to update project", error });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.status(200).json({ message: "Project deleted successfully", project });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project", error });
  }
};
