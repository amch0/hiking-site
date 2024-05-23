const Comments = require("../models/Comments");
const Users = require("../models/Users");

async function deleteComment(req, res) {
  try {
    const { userId } = req.user;
    const { commentId } = req.params;

    // Fetch user details
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is an admin
    if (user.type !== "admin") {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this comment" });
    }

    // Check if the comment exists
    const comment = await Comments.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Delete the comment
    await comment.destroy();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /comment/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       '200':
 *         description: Comment deleted successfully
 *       '403':
 *         description: Forbidden - user does not have permission to delete this comment
 *       '404':
 *         description: Comment or user not found
 *       '500':
 *         description: Internal server error
 */

module.exports = deleteComment;
