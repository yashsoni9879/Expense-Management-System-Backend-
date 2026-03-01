const Project = require("../models/project.model.js");

const getAll = async (req, res) => {
  try {
    console.log("get all projects api called");
    const projects = await Project.find();
    res.json({ message: "project fetched successfully", allProject: projects });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getByID = async (req, res) => {
  try {
    const projects = await Project.findById(req.params.id);
    if (!projects) {
      return res.status(404).json({ message: "project not found" });
    }
    res.json({ message: "project fetched successfully", projects: projects });
  } catch (err) {
    res.status(500).send(err);
  }
};

const insert = async (req, res) => {
  try {
    console.log("insert project api called with data:", req.body);
    const { projectName, isActive, userId } = req.body;

    const newproject = await Project.create({
      projectName,
      isActive,
      userId,
    });

    res.json({ message: "project created successfully", project: newproject });
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }
    res.json({ message: "project updated successfully", project: project });
  } catch (err) {
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }
    res.json({ message: "project deleted successfully", project: project });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getAll,
  getByID,
  insert,
  update,
  remove,
};
