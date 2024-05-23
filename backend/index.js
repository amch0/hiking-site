require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const app = express();
const port = 3000;
const Users = require("./models/Users");
const Tours = require("./models/Tours");
const UserTours = require("./models/UserTours");
const Comments = require("./models/Comments");
const sequelize = require("./db");
const userRoutes = require("./users/userRoutes");
const tourRoutes = require("./tours/tourRoutes");
const routesUserTour = require("./userTour/routesUserTour");
const commentRoutes = require("./userComments/commentRoutes");
const contactRoutes = require("./customerSupport/contactRoute.js");
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors());

const specs = require("./swaggerSpec");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(
  "/profilePictures",
  express.static(path.join(__dirname, "profilePictures"))
);
app.use("/tourImages", express.static(path.join(__dirname, "tourImages")));

app.get("/", (req, res) => {
  res.send("Hello Worldiii");
});

app.use("/users", userRoutes);
app.use("/tours", tourRoutes);
app.use("/userTour", routesUserTour);
app.use("/comment", commentRoutes);
app.use("/contact", contactRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync the database:", err);
  });
