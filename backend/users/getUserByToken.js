const Users = require("../models/Users");

const getUserByToken = async (req, res) => {
  try {
    const { userId } = req.user;

    const foundUser = await Users.findOne({
      where: {
        id: userId,
      },
    });

    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(foundUser);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /users/by-token:
 *   get:
 *     summary: Get user by token
 *     tags: [Users]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       '200':
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                 name:
 *                   type: string
 *                   description: The user's name
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 phone_number:
 *                   type: string
 *                   description: The user's phone number
 *                 location:
 *                   type: string
 *                   description: The user's location
 *                 profile_picture:
 *                   type: string
 *                   description: The user's profile picture
 *                 verified:
 *                   type: boolean
 *                   description: Whether the user is verified
 *       '401':
 *         description: Unauthorized - Invalid or missing token
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

module.exports = { getUserByToken };
