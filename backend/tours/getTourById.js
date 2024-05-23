const moment = require("moment");
const Tour = require("../models/Tours");

async function getTourById(req, res) {
  try {
    const { id } = req.params;

    const tour = await Tour.findByPk(id);

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Check and update status if the tour date has passed
    const tourDate = moment(tour.date);
    if (tourDate.isSameOrBefore(moment(), "day") && tour.status !== "done") {
      tour.status = "done";
      await tour.save();
    }

    res.status(200).json(tour);
  } catch (err) {
    console.error("Error fetching tour:", err);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * @swagger
 * /tours/{id}:
 *   get:
 *     summary: Get tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the tour to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. Returns the tour with the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewTour'
 *       '404':
 *         description: Tour not found.
 *       '500':
 *         description: Internal server error.
 */

module.exports = getTourById;
