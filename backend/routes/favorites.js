import express from "express";
const router = express.Router();
import {protect} from "../middleware/auth.js";
import User from "../models/user.js";

/**
 * @swagger
 * tags:
 *   - name: Favorites
 *     description: Favorite products management
 */

/**
 * @swagger
 * /api/favorites/add:
 *   post:
 *     summary: Add product to favorites
 *     tags: [Favorites]
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
 *     responses:
 *       200:
 *         description: Added to favorites
 */

// Add to favorites
router.post("/add", protect, async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.favorites.find(item => item.productId == productId)) {
            user.favorites.push({ productId });
        }

        await user.save();
        res.json({ message: "Added to favorites", favorites: user.favorites });

    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// Get favorites
router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("favorites.productId");
        res.json(user.favorites);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});
/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get current user's favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites list
 */

// Remove favorite
router.delete("/remove/:productId", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.favorites = user.favorites.filter(item => item.productId != req.params.productId);
        await user.save();
        res.json({ message: "Removed", favorites: user.favorites });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});
/**
 * @swagger
 * /api/favorites/remove/{productId}:
 *   delete:
 *     summary: Remove a favorite
 *     tags: [Favorites]
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
 *         description: Removed
 */

export default router;
