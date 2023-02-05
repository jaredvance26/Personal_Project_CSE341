const express = require("express");
const router = express.Router();

router.use("/movies", require("./movies"));
router.use("/", require("./swagger"));

module.exports = router;
