const Users = require("../models/Users");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ error: "Email, newPassword, and confirmPassword are required" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "New password and confirm password do not match" });
  }

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error executing reset password logic", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /users/resetPassword:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               newPassword:
 *                 type: string
 *                 description: The new password.
 *               confirmPassword:
 *                 type: string
 *                 description: The new password confirmation.
 *             example:
 *               email: user@example.com
 *               newPassword: newpassword123
 *               confirmPassword: newpassword123
 *     responses:
 *       '200':
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *       '400':
 *         description: Bad request, missing required fields or passwords do not match
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

module.exports = { resetPassword };
