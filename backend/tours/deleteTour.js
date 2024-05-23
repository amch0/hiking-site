const Tour = require("../models/Tours");

async function deleteTour(req, res) {
  try {
    const { userType } = req.user;
    if (userType !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden - User is not an admin" });
    }

    const { id } = req.params;
    const tour = await Tour.findByPk(id);

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    await tour.destroy();
    res
      .status(200)
      .json({ success: true, message: "Tour deleted successfully" });
  } catch (err) {
    console.error("Error deleting tour:", err);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * @swagger
 * /tours/{id}:
 *   delete:
 *     summary: Delete a tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tour to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted the tour
 *       '403':
 *         description: Forbidden - User is not an admin
 *       '404':
 *         description: Tour not found
 *       '500':
 *         description: Internal server error
 */

module.exports = deleteTour;
