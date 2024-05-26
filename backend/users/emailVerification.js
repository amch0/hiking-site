const User = require("../models/Users");

const emailVerification = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Find the user with the given verification token
    const verifiedUser = await User.findOne({
      where: { verification_token: token },
    });

    if (!verifiedUser) {
      return res.status(404).json({ error: "Invalid token" });
    }

    // Update the user's verification status
    verifiedUser.verified = true;
    await verifiedUser.save();

    // Redirect to login page
    res.redirect("http://localhost:8080/login");
  } catch (err) {
    console.error("Error executing verification", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = emailVerification;
