// server.js
// 1. Load environment variables
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

// 2. Import core libraries


// 3. Initialize the app and port
const app = express();
const PORT = process.env.PORT || 5000;



// 5. Middleware: This is essential for Express to read JSON data from requests
app.use(express.json());
app.use(cors());


// Swagger docs route
app.use("/herhair-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

// 6. Define a simple test route
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/categories', categoryRoutes);
connectDB();

// 7. Start the server
app.listen(PORT, () => console.log(`Server running in development mode on port ${PORT}`));