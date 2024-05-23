const moment = require("moment");
const Tour = require("../models/Tours");

async function getAllTours(req, res) {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (type) {
      whereClause.type = type;
    }

    // Count the total number of tours without pagination
    const totalToursCount = await Tour.count({
      where: whereClause,
    });

    const tours = await Tour.findAll({
      where: whereClause,
      order: [["date", "ASC"]], // Sort tours by date in ascending order
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Check and update status for each tour if the tour date has passed
    await Promise.all(
      tours.map(async (tour) => {
        const tourDate = moment(tour.date);
        if (
          tourDate.isSameOrBefore(moment(), "day") &&
          tour.status !== "done"
        ) {
          tour.status = "done";
          await tour.save();
        }
      })
    );

    // Fetch updated tours list after status updates
    const updatedTours = await Tour.findAll({
      where: whereClause,
      order: [["date", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalToursCount / parseInt(limit));

    res.status(200).json({
      success: true,
      totalPages,
      currentPage: parseInt(page),
      tours: updatedTours,
    });
  } catch (err) {
    console.error("Error fetching tours:", err);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of tours per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, done]
 *         description: Filter tours by status (active or done)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [BiH, domaca]
 *         description: Filter tours by type (BiH or strano)
 *     responses:
 *       '200':
 *         description: OK. Returns all tours ordered by nearest day.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '500':
 *         description: Internal server error.
 */

module.exports = getAllTours;
