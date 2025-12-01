import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wig Store API",
      version: "1.0.0",
      description: "API documentation for Wig Store",
    },
    servers: [
      {
    url: process.env.NODE_ENV === "production"
      ? "https://wig-api.onrender.com/"
      : "http://localhost:5000",
  },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  // Use an absolute path so swagger-jsdoc can find the route files
  apis: [path.join(__dirname, 'routes', '*.js')],
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiMiddleware = swaggerUi;
