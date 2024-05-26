const Users = require("../models/Users");
const nodemailer = require("nodemailer");
const emailConfig = require("../emailConfig");

const sendResetEmail = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
      from: "elhapvc@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return "Password reset email sent. Please check your email for further instructions.";
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error("Error sending password reset email");
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetLink = `http://localhost:8080/resetPassword`;

    const resetEmailMessage = await sendResetEmail(email, resetLink);

    res.json({ message: resetEmailMessage });
  } catch (err) {
    console.error("Error executing forgot password logic", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /users/forgotPassword:
 *   post:
 *     summary: Request password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *             example:
 *               email: user@example.com
 *     responses:
 *       '200':
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *       '400':
 *         description: Bad request, missing required fields
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

module.exports = { forgotPassword };
