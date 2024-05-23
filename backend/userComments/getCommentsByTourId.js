const Comments = require("../models/Comments");
const Users = require("../models/Users");

async function getCommentsByTourId(req, res) {
  try {
    const { tourId } = req.params;

    // Fetch comments for the given tour ID
    const comments = await Comments.findAll({
      where: { tourId },
      include: [
        {
          model: Users,
          attributes: ["id", "name", "profile_picture"],
        },
      ],
    });

    // Map the results to include user details
    const response = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      rating: comment.rating,
      date: comment.date,
      user: {
        id: comment.User.id,
        name: comment.User.name,
        profile_picture: comment.User.profile_picture,
      },
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /comment/tour/{tourId}:
 *   get:
 *     summary: Get all comments for a tour by tour ID
 *     tags: [Comments]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tour
 *     responses:
 *       '200':
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The comment ID
 *                   content:
 *                     type: string
 *                     description: The content of the comment
 *                   rating:
 *                     type: number
 *                     description: The rating given in the comment
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date the comment was created
 *                   user:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the user who created the comment
 *                       profile_picture:
 *                         type: string
 *                         description: The profile picture URL of the user who created the comment
 *       '404':
 *         description: Tour not found
 *       '500':
 *         description: Internal server error
 */

module.exports = getCommentsByTourId;
