const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My API",
    description: "Contacts API",
  },
  host: "vance-cse-341-personal-project.onrender.com",
  schemes: ["http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

// // generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
