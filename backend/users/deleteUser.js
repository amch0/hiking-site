const User = require("../models/Users");

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.user;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *       '401':
 *         description: Unauthorized - Invalid or missing token
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

module.exports = deleteUser;
