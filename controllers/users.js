const e = require("express");
const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  const result = await mongodb.getDb().db("movies").collection("users").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("User not found in database");
  }

  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db("movies")
    .collection("users")
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists[0]);
  });
};

const addUser = async (req, res) => {
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    dob: req.body.dob,
  };

  if (user.first_name && user.last_name && user.dob) {
    const response = await mongodb
      .getDb()
      .db("movies")
      .collection("users")
      .insertOne(user);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json(response.error || "Some error occurred while adding the user.");
    }
  } else {
    res
      .status(400)
      .json(
        "Oops! Look like all fields are required and at least one was missing"
      );
  }
};

const updateUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Movie not found in database");
  }

  const userId = new ObjectId(req.params.id);

  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    dob: req.body.dob,
  };

  if (user.first_name && user.last_name && user.dob) {
    const response = await mongodb
      .getDb()
      .db("movies")
      .collection("users")
      .replaceOne({ _id: userId }, user);
    console.log(response);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || "Oops, something went wrong updating the user");
    }
  } else {
    res
      .status(500)
      .json("Oops! Look like all fields are required and one was missing");
  }
};

const deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("User not found in database");
  }

  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db("movies")
    .collection("users")
    .remove({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while deleting the user.");
  }
};

module.exports = {
  getAll,
  getSingle,
  addUser,
  updateUser,
  deleteUser,
};
