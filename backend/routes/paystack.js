import express from "express";
import axios from "axios";
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
router.get("/verify/:reference", async (req, res) => {
  try {
    const reference = req.query.reference;

    const verify = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (verify.data.data.status !== "success") {
      return res.status(400).json({ message: "Payment failed" });
    }

    res.json({ message: "Payment verified", data: verify.data.data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
});

export default router;
