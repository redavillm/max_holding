const express = require("express");
const {
  getCars,
  getMarksWithCounts,
} = require("../controllers/stockController");

const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => getCars(db, req, res));

  router.get("/marks", (req, res) => getMarksWithCounts(db, req, res));

  return router;
};
