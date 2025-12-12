import express from "express";
const router = express.Router();
import {protect} from "../middleware/auth.js";
import User from "../models/user.js";

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart operations
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added
 */

// Add to cart
router.post("/add", protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await User.findById(req.user.id);

        const item = user.cart.find(item => item.productId == productId);

        if (item) {
            item.quantity += quantity || 1;
        } else {
            user.cart.push({ productId, quantity: quantity || 1 });
        }

        await user.save();
        res.json({ message: "Added to cart", cart: user.cart });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Get cart
router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("cart.productId");
        res.json(user.cart);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});
/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart
 */

// Remove from cart
router.delete("/remove/:productId", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = user.cart.filter(item => item.productId != req.params.productId);
        await user.save();

        res.json({ message: "Removed", cart: user.cart });

    } catch (err) {
        res.status(500).send("Server Error");
    }
});
/**
 * @swagger
 * /api/cart/remove/{productId}:
 *   delete:
 *     summary: Remove an item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed
 */

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update quantity for a product in the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *             required:
 *               - productId
 *               - quantity
 *     responses:
 *       200:
 *         description: Cart updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: array
 *       400:
 *         description: Bad request (missing fields or invalid quantity)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not in cart
 *       500:
 *         description: Server error
 */
// Update cart quantity
router.put("/update", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const user = await User.findById(req.user.id);
    const item = user.cart.find(item => item.productId.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    item.quantity = quantity; // update quantity
    await user.save();

    res.json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


export default router;
