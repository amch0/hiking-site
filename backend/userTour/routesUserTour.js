const express = require("express");
const router = express.Router();
const verifyToken = require("../verifyToken");
const assignUserToTour = require("./assignUserToTour");
const getUsersAssignedToTour = require("./getUsersAssignedToTour");
const generatePDFFile = require("./generatePDFFile");

router.post("/assign", verifyToken, assignUserToTour);
router.get("/:tourId", getUsersAssignedToTour);
router.get("/downloadPDF/:tourId", generatePDFFile);

module.exports = router;
