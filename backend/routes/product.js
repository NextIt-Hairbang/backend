import express from "express";
import Product from "../models/product.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB generated id
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         quantity:
 *           type: integer
 *       required:
 *         - name
 *         - price
 */

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product management
 */

/**
 * @swagger
 * /api/products/new:
 *   post:
 *     summary: Create a new product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin privileges required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin privileges required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin privileges required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/{id}/sell:
 *   post:
 *     summary: Decrement product quantity (sell) (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock updated
 *       400:
 *         description: Not enough stock
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin privileges required
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/{id}/restock:
 *   post:
 *     summary: Increment product quantity (restock) (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock restocked
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin privileges required
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/status/{status}:
 *   get:
 *     summary: Filter products by stock status
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["in stock", "low stock", "out of stock"]
 *     responses:
 *       200:
 *         description: List of products matching status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid status
 *       500:
 *         description: Server error
 */

// CREATE PRODUCT
router.post("/new", protect, isAdmin, async (req, res) => {
  try {
    const { name, price, discountedPrice, images, description, category } =
      req.body;
    const quantity = req.body.quantity ?? 0; // ensures 0 if undefined

    const product = await Product.create({
      name,
      price,
      discountedPrice: discountedPrice ?? null,
      images,
      description,
      category,
      quantity,
      length: Number,
      color: String,
      texture: String,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name slug");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET PRODUCT BY ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PRODUCT
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const {
      name,
      price,
      discountedPrice,
      images,
      description,
      category,
      quantity,
      length,
      color,
      texture,
    } = req.body;
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (discountedPrice !== undefined)
      product.discountedPrice = discountedPrice || null;
    if (Array.isArray(images) && images.length > 0) {
      product.images = images;
    }
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (quantity !== undefined) product.quantity = quantity;

    product = await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE PRODUCT
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DECREMENT QUANTITY (SELL)
router.post("/:id/sell", protect, isAdmin, async (req, res) => {
  try {
    const { amount = 1 } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.quantity < amount) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    product.quantity -= amount;
    await product.save();

    res.json({ message: "Stock updated", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// **RESTOCK PRODUCT** (INCREMENT QUANTITY)
router.post("/:id/restock", protect, isAdmin, async (req, res) => {
  try {
    const { amount = 1 } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.quantity += amount;
    await product.save();

    res.json({ message: "Stock restocked", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// **FILTER PRODUCTS BY STOCK STATUS**
router.get("/status/:status", async (req, res) => {
  try {
    const { status } = req.params;
    if (!["in stock", "low stock", "out of stock"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const products = await Product.find({ status }).populate(
      "category",
      "name slug"
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
