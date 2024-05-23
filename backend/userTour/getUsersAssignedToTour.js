const UserTours = require("../models/UserTours");
const Tours = require("../models/Tours");
const User = require("../models/Users");

async function getUsersAssignedToTour(req, res) {
  try {
    const { tourId } = req.params;

    // Check if the tour exists
    const tour = await Tours.findByPk(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Get all users assigned to the tour
    const assignedUsers = await UserTours.findAll({
      where: {
        tourId,
      },
      attributes: ["userId"], // Only select the userId attribute
    });

    // Extract user IDs from assignedUsers array
    const userIds = assignedUsers.map((userTour) => userTour.userId);

    // Get user details corresponding to the user IDs
    const users = await User.findAll({
      where: {
        id: userIds,
      },
      attributes: ["id", "name", "email", "phone_number"],
    });

    return res.status(200).json({
      tourTitle: tour.title,
      assignedUsers: users,
    });
  } catch (error) {
    console.error("Error getting users assigned to tour:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /userTour/{tourId}:
 *   get:
 *     summary: Get all users assigned to a tour
 *     tags: [Tours Assignment]
 *     parameters:
 *       - in: path
 *         name: tourId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the tour.
 *     responses:
 *       '200':
 *         description: Successfully retrieved users assigned to the tour
 *       '404':
 *         description: Tour not found
 *       '500':
 *         description: Internal server error
 */

module.exports = getUsersAssignedToTour;
