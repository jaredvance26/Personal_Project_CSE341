const e = require("express");
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
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Movie not found in database");
  }

  const movieId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db("movies")
    .collection("movies")
    .find({ _id: movieId });
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

  if (
    movie.movie_director &&
    movie.movie_summary &&
    movie.movie_title &&
    movie.genre &&
    movie.release_year &&
    movie.box_office
  ) {
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
        .json(
          response.error || "Some error occurred while creating the movie."
        );
    }
  } else {
    res
      .status(400)
      .json("Oops! Look like all fields are required and one was missing");
  }
};

const updateMovie = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Movie not found in database");
  }

  const movieId = new ObjectId(req.params.id);
  const movie = {
    movie_director: req.body.movie_director,
    movie_summary: req.body.movie_summary,
    movie_title: req.body.movie_title,
    genre: req.body.genre,
    release_year: req.body.release_year,
    box_office: req.body.box_office,
  };

  if (
    movie.movie_director &&
    movie.movie_summary &&
    movie.movie_title &&
    movie.genre &&
    movie.release_year &&
    movie.box_office
  ) {
    const response = await mongodb
      .getDb()
      .db("movies")
      .collection("movies")
      .replaceOne({ _id: movieId }, movie);
    console.log(response);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error || "Oops, something went wrong updating the movie"
        );
    }
  } else {
    res
      .status(500)
      .json("Oops! Look like all fields are required and one was missing");
  }
};

const deleteMovie = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Movie not found in database");
  }

  const movieId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db("movies")
    .collection("movies")
    .remove({ _id: movieId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while deleting the contact."
      );
  }
};

module.exports = {
  getAll,
  getSingle,
  addMovie,
  updateMovie,
  deleteMovie,
};
