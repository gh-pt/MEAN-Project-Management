import { Request, Response } from "express";
import { Project } from "../models/Project.model";
import "dotenv/config";

// Get the All Projects
export const getAllProjects = async (
  req: Request,
  res: Response
) => {
  try {
    const projects = await Project.find().populate({
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
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get the Project by ID
export const getProjectById = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id).populate({
      path: "Owner",
      select: "Username",
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).send(error);
  }
};

// get the project by name
export const getProjectByName = async (
  req: Request,
  res: Response
) => {
  const { name } = req.params;
  try {
    const project = await Project.findOne({ ProjectName: name })
      .populate({
        path: "Owner",
        select: "Username",
      });
    res.status(200).json([project]);
  } catch (error) {
    res.status(500).send(error);
  }
};

// get the all project by owner
export const getProjectByOwner = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const project = await Project.find({ Owner: id })
      .populate({
        path: "Owner",
        select: "Username",
      });
    res.status(200).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
};

// add project
export const addProject = async (
  req: Request,
  res: Response
) => {
  const { ProjectName, Details, DemoLink, GithubRepository, Owner } = req.body;
  try {
    const project = new Project(
      {
        ProjectName,
        Details,
        DemoLink,
        GithubRepository,
        Owner
      }
    );
    await project.save();
    res.status(200).json({ message: "Project Added", project });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// update project
export const updateProject = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { ProjectName, Details, DemoLink, GithubRepository, Owner } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(id, {
      ProjectName,
      Details,
      DemoLink,
      GithubRepository,
      Owner,
    }, { new: true });
    res.status(200).json({ message: "Project Updated", project });
  } catch (error) {
    res.status(500).send(error);
  }
};

// delete project
export const deleteProject = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndDelete(id);
    res.status(200).json({ message: "Project Deleted", project });
  } catch (error) {
    res.status(500).send(error);
  }
};
