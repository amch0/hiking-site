const express = require("express");
const router = express.Router();
const createTour = require("./createTour");
const getTourById = require("./getTourById");
const getAllTours = require("./getAllTours");
const verifyToken = require("../verifyToken");
const deleteTour = require("./deleteTour");

router.get("/", getAllTours);
router.delete("/:id", verifyToken, deleteTour);
router.get("/:id", getTourById);
router.post("/create", verifyToken, createTour);

module.exports = router;
