const express = require("express");
const router = express.Router();

router.use("/movies", require("./movies"));
router.use("/users", require("./users"));
router.use("/", require("./swagger"));

module.exports = router;
