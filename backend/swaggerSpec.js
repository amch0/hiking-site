const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gorske price APIs",
      version: "1.0.0",
      description: "API endpoints",
    },
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
    },
    security: [{ apiKeyAuth: [] }],
  },
  apis: [
    "./users/registration.js",
    "./users/login.js",
    "./users/deleteUser.js",
    "./users/getAllUsers.js",
    "./users/getUserById.js",
    "./users/getUserByToken.js",
    "./users/forgotPassword.js",
    "./users/resetPassword.js",
    "./tours/createTour.js",
    "./tours/getTourById.js",
    "./tours/getAllTours.js",
    "./tours/deleteTour.js",
    "./userTour/assignUserToTour.js",
    "./userTour/getUsersAssignedToTour.js",
    "./userTour/generatePDFFile.js",
    "./userComments/createComment.js",
    "./userComments/getCommentsByTourId.js",
    "./userComments/deleteComment.js",
    "./customerSupport/contact.js",
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
