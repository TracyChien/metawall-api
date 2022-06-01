const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "MetaWall-API",
    description: "",
  },
  host: "localhost:3000",
  schemes: ["http"],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "headers",
      name: "Authorization",
      description: "Token 前請加上 Bearer，<code>Bearer ＜Token＞</code>",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
