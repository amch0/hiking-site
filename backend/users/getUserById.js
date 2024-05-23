const User = require("../models/Users");

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await User.findByPk(userId);

    // If user is not found, return 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user is found, send user object in response
    res.json(user);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve
 *     responses:
 *       '200':
 *         description: Successful retrieval of the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         type:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone_number:
 *           type: string
 *         location:
 *           type: string
 *         profile_picture:
 *           type: string
 *         verified:
 *           type: boolean
 *         verification_token:
 *           type: string
 *       required:
 *         - id
 *         - email
 *         - password
 *         - verified
 *         - verification_token
 *       example:
 *         id: 123
 *         type: client
 *         name: Sleman Rizvan
 *         email: selman@example.com
 *         phone_number: "+1234567890"
 *         location: " sarajevo"
 *         profile_picture: "https://example.com/profile.jpg"
 *         verified: true
 *         verification_token: "abcdef123456"
 */

module.exports = getUserById;
