import express from "express";
import Product from "../models/product.js";

const router = express.Router();

router.post("/complete", async (req, res) => {
  try {
    const { items } = req.body; 
    // items = [{ productId, quantity }]

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    res.json({ message: "Stock updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout failed" });
  }
});

export default router;
