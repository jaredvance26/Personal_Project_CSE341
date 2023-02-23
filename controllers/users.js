const e = require("express");
const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;
const { authenticate } = require("@google-cloud/local-auth");

const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/contacts.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  //   let client = await loadSavedCredentialsIfExist();
  //   if (client) {
  //     console.log(client);
  //     return client;
  //   }
  let client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }

  return client;
}

const getAll = async (req, res) => {
  const result = await mongodb.getDb().db("movies").collection("users").find();

  const getResult = () => {
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  };
  authorize().then(getResult).catch(console.error);
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
  const getResult = () => {
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  };
  authorize().then(getResult).catch(console.error);
};

const addUser = async (req, res) => {
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    dob: req.body.dob,
  };

  if (user.first_name && user.last_name && user.dob) {
    const response = mongodb
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
