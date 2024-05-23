const Comments = require("../models/Comments");
const Users = require("../models/Users");
const Tours = require("../models/Tours");

async function createComment(req, res) {
  try {
    const { userId } = req.user;
    const { tourId, content, rating } = req.body;

    // Validate input
    if (
      !tourId ||
      !content ||
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Check if user exists
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if tour exists
    const tour = await Tours.findByPk(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Check if the user has already left a comment on this tour
    const existingComment = await Comments.findOne({
      where: {
        userId,
        tourId,
      },
    });
    if (existingComment) {
      return res
        .status(400)
        .json({ message: "You have already commented on this tour" });
    }

    // Create the comment
    const comment = await Comments.create({
      userId,
      tourId,
      content,
      rating,
      date: new Date(),
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Leave a comment on a tour
 *     tags: [Comments]
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
 *               content:
 *                 type: string
 *                 description: The content of the comment.
 *               rating:
 *                 type: number
 *                 description: The rating for the tour (1-5).
 *             example:
 *               tourId: "123456"
 *               content: "Great tour, had a wonderful time!"
 *               rating: 5
 *     responses:
 *       '201':
 *         description: Comment created successfully
 *       '400':
 *         description: Invalid input or user has already commented on this tour
 *       '404':
 *         description: User or tour not found
 *       '500':
 *         description: Internal server error
 */

module.exports = createComment;
