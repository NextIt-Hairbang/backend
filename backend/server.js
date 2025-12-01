// server.js
import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import { swaggerSpec, swaggerUiMiddleware } from "./swagger.js";
import cartRoutes from './routes/cart.js';
import favoritesRoutes from './routes/favorites.js';
import categoryRoutes from './routes/category.js';

dotenv.config();
console.log("DEBUG → Render PORT env variable:", process.env.PORT);

const app = express();
const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(express.json());


// CORS: allow frontend domain in production, all origins in development
const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://hair-bang.vercel.app"]
  : ["*"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // mobile, curl, etc.

    if (
      allowedOrigins.includes("*") ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.some(o => origin.startsWith(o))
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options("/*", cors());




// Swagger docs (after CORS middleware so Try-it-out can call the API)
app.use("/herhair-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));


// Test route
app.get("/", (req, res) => {
  res.json({ message: "Wig backend is running!" });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/categories', categoryRoutes);

// Connect DB
connectDB();

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
