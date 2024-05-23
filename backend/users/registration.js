const User = require("../models/Users");
const nodemailer = require("nodemailer");
const emailConfig = require("../emailConfig");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");

const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15);
};

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
      from: "elhapvc@gmail.com",
      to: email,
      subject: "User Verification",
      text: `Click the following link to verify your email: http://localhost:3000/users/verify?token=${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    return "Verification email sent. Please check your email for further instructions.";
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error("Error sending verification email");
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../profilePictures/"));
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

async function registerUser(req, res) {
  try {
    const { name, email, password, phone_number, location } = req.body;
    let { type } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!type) {
      type = "client";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email is already used
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        error: "Email is already in use. Please use a different email.",
      });
    }

    const timestamp = new Date().valueOf().toString();
    const uniqueId = `${timestamp}`;
    const verificationToken = generateVerificationToken();

    let profilePicture = null;
    if (req.file) {
      profilePicture = `/profilePictures/${req.file.filename}`;
    }

    const newUser = await User.create({
      id: uuidv4(),
      type,
      name,
      email,
      phone_number,
      location,
      password: hashedPassword,
      profile_picture: profilePicture,
      verified: false,
      verification_token: verificationToken,
    });

    // Send verification email
    const verificationEmailMessage = await sendVerificationEmail(
      email,
      verificationToken
    );

    res.status(201).json({ ...newUser.toJSON(), verificationEmailMessage });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Internal Server Error");
  }
}
/**
 * @swagger
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email.
 *         type:
 *           type: string
 *           description: The user's type.
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password.
 *         phone_number:
 *           type: string
 *           description: The user's phone number (optional).
 *         location:
 *           type: string
 *           description: The user's location (optional).
 *         profilePicture:
 *           type: string
 *           format: binary
 *           description: The user's profile picture (optional). Provide as a file.
 *       example:
 *         name: Selman Rizvan
 *         email: selman@example.com
 *         password: password123
 *         type: client
 *         phone_number: "+1234567890"
 *         location: visoko
 *         profile_picture: "https://example.com/profile.jpg"
 *
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       '201':
 *         description: Successfully registered
 *       '400':
 *         description: Bad request, missing required fields
 *       '409':
 *         description: Email is already in use
 *       '500':
 *         description: Internal server error
 */

module.exports = { registerUser, upload };
