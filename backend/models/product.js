import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountedPrice: {
      type: Number,
      default: null,
    },

    images: {
      type: [String], // array of image URLs
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    length: {
      type: Number, // e.g. 12, 14, 16, 18
    },

    color: {
      type: String, // e.g. Black, Brown, Blonde
    },

    texture: {
      type: String, // e.g. Straight, Body Wave, Curly
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in stock", "low stock", "out of stock"],
      default: "in stock",
    },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (this.discountedPrice !== null && this.discountedPrice >= this.price) {
    return next(new Error("Discounted price must be less than price"));
  }
  next();
});

productSchema.pre("save", function (next) {
  if (this.quantity === 0) this.status = "out of stock";
  else if (this.quantity < 5)
    this.status = "low stock"; // threshold for low stock
  else this.status = "in stock";
  next();
});
// Prevent OverwriteModelError
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
