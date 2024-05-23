const express = require("express");
const router = express.Router();

const { registerUser, upload } = require("./registration");
const emailVerification = require("./emailVerification");
const login = require("./login");
const verifyToken = require("../verifyToken");
const deleteUser = require("./deleteUser");
const getAllUsers = require("./getAllUsers");
const getUserById = require("./getUserById");
const { getUserByToken } = require("./getUserByToken");
const { forgotPassword } = require("./forgotPassword");
const { resetPassword } = require("./resetPassword");

router.get("/", getAllUsers);
router.get("/by-token", verifyToken, (req, res) => getUserByToken(req, res));
router.post("/resetPassword", resetPassword);
router.get("/verify", (req, res) => emailVerification(req, res));
router.delete("/", verifyToken, deleteUser);
router.get("/:userId", getUserById);
router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);

module.exports = router;
