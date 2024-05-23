const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Tour = require("../models/Tours");
const moment = require("moment");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../tourImages/"));
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage }).array("images", 10);

async function createTour(req, res) {
  try {
    const { userType } = req.user;
    if (userType !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden - User is not an admin" });
    }
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Error uploading files" });
      }

      const {
        title,
        date,
        difficulty,
        duration,
        description,
        equipment,
        price,
        limit_number,
        type,
      } = req.body;

      if (
        !title ||
        !date ||
        !difficulty ||
        !duration ||
        !description ||
        !price ||
        !limit_number ||
        !type
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      let images = [];
      if (req.files) {
        images = req.files.map((file) => `/tourImages/${file.filename}`);
      }

      const tourDate = moment(date, "YYYY-MM-DD");
      const status = tourDate.isSameOrBefore(moment(), "day")
        ? "done"
        : "active";

      const newTour = await Tour.create({
        id: uuidv4(),
        title,
        date: tourDate.toDate(),
        difficulty,
        duration,
        description,
        equipment,
        price,
        limit_number,
        remaining_space: limit_number,
        type,
        status,
        images,
      });

      res.status(201).json(newTour);
    });
  } catch (err) {
    console.error("Error creating tour:", err);
    res.status(500).send("Internal Server Error");
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     NewTour:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - difficulty
 *         - duration
 *         - description
 *         - price
 *         - limit_number
 *         - type
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the tour.
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the tour (YYYY-MM-DD).
 *         difficulty:
 *           type: string
 *           description: The difficulty level of the tour.
 *         duration:
 *           type: string
 *           description: The duration of the tour.
 *         description:
 *           type: string
 *           description: Description of the tour.
 *         equipment:
 *           type: string
 *           description: Equipment required for the tour.
 *         price:
 *           type: string
 *           description: The price of the tour.
 *         limit_number:
 *           type: integer
 *           description: The maximum number of participants for the tour.
 *         type:
 *           type: string
 *           description: The type of the tour.
 *         images:
 *           type: array
 *           items:
 *             type: file
 *           description: Array of image files for the tour. Select files from your local machine.
 *       example:
 *         title: Hiking Adventure
 *         date: 2024-08-14
 *         difficulty: Intermediate
 *         duration: 3 hours
 *         description: Enjoy a thrilling hiking adventure through scenic trails.
 *         equipment: Hiking boots, water bottle, sunscreen.
 *         price: $50
 *         limit_number: 15
 *         type: Hiking
 *         images: [image1.jpg, image2.jpg]
 *
 */

/**
 * @swagger
 * /tours/create:
 *   post:
 *     summary: Create a new tour
 *     tags: [Tours]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/NewTour'
 *     responses:
 *       '201':
 *         description: Successfully created a new tour
 *       '400':
 *         description: Bad request, missing required fields
 *       '500':
 *         description: Internal server error
 */

module.exports = createTour;
