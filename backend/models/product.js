import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    length: {
      type: String, // e.g. "12", "14", "18"
      trim: true,
      lowercase: true,
    },

    color: {
      type: String, // e.g. "black", "brown"
      trim: true,
      lowercase: true,
    },

    texture: {
      type: String, // e.g. "deep wave", "body wave"
      trim: true,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["in stock", "low stock", "out of stock"],
      default: "in stock",
    },
  },
  { timestamps: true }
);

// 🔒 Discount validation
productSchema.pre("validate", function (next) {
  if (this.discountedPrice !== null && this.discountedPrice >= this.price) {
    return next(new Error("Discounted price must be less than price"));
  }
  next();
});

// 📦 Stock + normalization
productSchema.pre("save", function (next) {
  if (this.quantity === 0) this.status = "out of stock";
  else if (this.quantity < 5) this.status = "low stock";
  else this.status = "in stock";

  next();
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
