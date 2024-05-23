const UserTours = require("../models/UserTours");
const Tours = require("../models/Tours");

async function assignUserToTour(req, res) {
  try {
    const { tourId } = req.body;
    const { userId } = req.user;

    // Check if the tour exists
    const tour = await Tours.findByPk(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Check if the tour is active
    if (tour.status !== "active") {
      return res.status(400).json({ message: "Tour is not active" });
    }

    // Check if there is remaining space for the tour
    if (tour.remaining_space <= 0) {
      return res
        .status(400)
        .json({ message: "No remaining space for this tour" });
    }

    // Check if the user is already assigned to the tour
    const existingAssignment = await UserTours.findOne({
      where: {
        userId,
        tourId,
      },
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ message: "User is already assigned to this tour" });
    }

    // If the user is not assigned to the tour, create a new assignment
    await UserTours.create({
      userId,
      tourId,
    });

    // Decrement remaining_space for the tour
    await Tours.update(
      { remaining_space: tour.remaining_space - 1 },
      { where: { id: tourId } }
    );

    return res
      .status(201)
      .json({ message: "User assigned to tour successfully" });
  } catch (error) {
    console.error("Error assigning user to tour:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /userTour/assign:
 *   post:
 *     summary: Assign a user to a tour
 *     tags: [Tours Assignment]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *                 description: The ID of the tour.
 *             example:
 *               tourId: "123456"
 *     responses:
 *       '201':
 *         description: User assigned to tour successfully
 *       '400':
 *         description: Bad request or user already assigned to the tour
 *       '404':
 *         description: Tour not found
 *       '500':
 *         description: Internal server error
 */

module.exports = assignUserToTour;
