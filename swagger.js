const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My API",
    description: "Contacts API",
  },
  host: "vance-cse-341.onrender.com",
  schemes: ["https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

// // generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
