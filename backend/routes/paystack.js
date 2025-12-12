import express from "express";
import axios from "axios";
import { protect } from "../middleware/auth.js";
import Product from "../models/product.js";
import User from "../models/user.js";

const router = express.Router();

// INIT PAYSTACK
router.post("/init", async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // convert to kobo
        metadata
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.json(paystackRes.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Paystack init failed" });
  }
});


// VERIFY PAYSTACK
// verify payment and update stock
router.get("/verify/:reference", protect, async (req, res) => {
  try {
    const reference = req.params.reference;

    // call Paystack verify API
    const verify = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    // check if payment succeeded
    if (verify.data.data.status !== "success") {
      return res.status(400).json({ message: "Payment failed" });
    }

    // 1️⃣ Update stock
    const cart = verify.data.data.metadata.cart;
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.quantity = Math.max(product.quantity - item.quantity, 0);
        await product.save();
      }
    }

    // 2️⃣ Clear user's cart
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    // 3️⃣ Respond to frontend
    res.json({ message: "Payment verified and stock updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
});



export default router;
