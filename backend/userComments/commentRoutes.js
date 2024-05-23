const express = require("express");
const router = express.Router();

const verifyToken = require("../verifyToken");
const createComment = require("./createComment");
const getCommentsByTourId = require("./getCommentsByTourId");
const deleteComment = require("./deleteComment");

router.post("/", verifyToken, createComment);
router.get("/tour/:tourId", getCommentsByTourId);
router.delete("/:commentId", verifyToken, deleteComment);

module.exports = router;
