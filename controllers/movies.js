const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  const result = await mongodb.getDb().db("movies").collection("movies").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db("movies")
    .collection("movies")
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists[0]);
  });
};

const addMovie = async (req, res) => {
  const movie = {
    movie_director: req.body.movie_director,
    movie_summary: req.body.movie_summary,
    movie_title: req.body.movie_title,
    genre: req.body.genre,
    release_year: req.body.release_year,
    box_office: req.body.box_office,
  };
  const response = await mongodb
    .getDb()
    .db("movies")
    .collection("movies")
    .insertOne(movie);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while creating the movie.");
  }
};

module.exports = {
  getAll,
  getSingle,
  addMovie,
};
