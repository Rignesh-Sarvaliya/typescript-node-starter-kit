import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smartinbox API",
      version: "1.0.0",
      description: "Documentation for Smartinbox Admin + User APIs",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./src/routes/**/*.ts"], // comment-based documentation
});
