const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const storedPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // if (!user.verified) {
    //   return res.status(403).json({ error: "Email not verified" });
    // }

    // User authentication successful, generate a JWT token
    const { id, type, name, email: userEmail } = user;

    const secretKey = process.env.JWT_SECRET || "default-secret-key";
    const token = jwt.sign({ userId: id, userType: type }, secretKey, {
      expiresIn: "24h",
    });

    // const decodedToken = jwt.decode(token, { complete: true });
    // console.log("Decoded Token:", decodedToken);

    res.json({ token });
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email.
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password.
 *       example:
 *         email: example@example.com
 *         password: password123
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login as a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user
 *       '400':
 *         description: Bad request, missing required fields
 *       '401':
 *         description: Unauthorized - Invalid email or password
 *       '403':
 *         description: Forbidden - Email not verified
 *       '500':
 *         description: Internal server error
 */

module.exports = login;
