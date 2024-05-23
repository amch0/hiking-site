const UserTours = require("../models/UserTours");
const Tours = require("../models/Tours");
const User = require("../models/Users");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function generatePDFFile(req, res) {
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
      attributes: ["name", "email", "phone_number"],
    });

    // Convert users data to plain objects
    const usersData = users.map((user) => user.get({ plain: true }));

    // Ensure the directory exists, create it if it doesn't
    const pdfDirectory = "/app/pdfs";
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, { recursive: true });
    }

    // Define the Downloads directory path
    // const downloadsPath = "/Users/ahmedhalilovic/Downloads";

    // Generate a unique file name
    const fileName = `users_assigned_to_tour_${tourId}.pdf`;

    // Define the file path
    // const filePath = path.join(downloadsPath, fileName);
    const filePath = path.join(pdfDirectory, fileName);

    // Create a PDF document
    const doc = new PDFDocument();

    // Pipe its output to a file
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Add tour title
    doc.fontSize(18).text(`Users Assigned to Tour: ${tour.title}`, {
      align: "center",
    });

    // Add tour date
    doc.fontSize(14).text(`Date of Tour: ${tour.date}`, {
      align: "center",
    });

    doc.moveDown();

    // Add user details
    users.forEach((user) => {
      doc.fontSize(12).text(`Name: ${user.name}`);
      doc.fontSize(12).text(`Email: ${user.email}`);
      doc.fontSize(12).text(`Phone Number: ${user.phone_number}`);
      doc.moveDown();
    });

    // Finalize the PDF and end the stream
    doc.end();

    // Listen for the 'finish' event to ensure the file has been written
    writeStream.on("finish", () => {
      console.log(`File saved to ${filePath}`);

      // Send the PDF file as a download
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error("Error downloading PDF file:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error writing PDF file:", err);
      return res.status(500).json({ message: "Internal server error" });
    });
  } catch (error) {
    console.error("Error generating PDF file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /userTour/downloadPDF/{tourId}:
 *   get:
 *     summary: Generate PDF file containing users assigned to a tour
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
 *         description: PDF file containing users assigned to the tour
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       '404':
 *         description: Tour not found
 *       '500':
 *         description: Internal server error
 */

module.exports = generatePDFFile;
