const User = require("../models/Users");

const getAllUsers = async (req, res) => {
  try {
    let { page = 1, pageSize = 10 } = req.query;
    page = +page;
    pageSize = +pageSize;

    const users = await User.findAll({
      order: [["id"]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    res.json(users);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       '200':
 *         description: Successful retrieval of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '500':
 *         description: Internal server error
 */

module.exports = getAllUsers;
