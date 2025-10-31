import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Teacher's Portal API", version: "1.2.0" },
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  apis: [
    "./src/routes/*.ts",
    "./dist/src/routes/*.js",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
