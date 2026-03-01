const People = require("../models/people.model.js");

const getAll = async (req, res) => {
  try {
    console.log("get all people api called");
    const peoples = await People.find();
    res.json({ message: "people fetched successfully", allpeoples: peoples });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getByID = async (req, res) => {
  try {
    const peoples = await People.findById(req.params.id);
    if (!peoples) {
      return res.status(404).json({ message: "peoples not found" });
    }
    res.json({ message: "peoples fetched successfully", peoples: peoples });
  } catch (err) {
    res.status(500).send(err);
  }
};

const insert = async (req, res) => {
  try {
    console.log("insert peoples api called with data:", req.body);

    const { password, peopleName, email, userId } = req.body;

    const newpeoples = await People.create({
      password,
      peopleName,
      email,
      userId,
    });

    res.json({ message: "peoples created successfully", peoples: newpeoples });
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  try {
    const peoples = await People.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!peoples) {
      return res.status(404).json({ message: "peoples not found" });
    }
    res.json({ message: "peoples updated successfully", peoples: peoples });
  } catch (err) {
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  try {
    const peoples = await People.findByIdAndDelete(req.params.id);
    if (!peoples) {
      return res.status(404).json({ message: "peoples not found" });
    }
    res.json({ message: "peoples deleted successfully", peoples: peoples });
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
