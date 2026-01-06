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
      type: Number, // inches
      min: 8,
      max: 30,
    },

    color: {
      type: [String], // e.g. Black, Brown, Blonde
      default: [],
      trim: true,
    },

    texture: {
      type: String,
      enum: ["straight", "body wave", "curly", "wavy"],
      lowercase: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: { type: Number, default: 0 },
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

  if (this.length) {
    this.length = this.length.toLowerCase().trim();
  }

  if (this.color) {
    this.color = this.color.map((c) => c.toLowerCase().trim());
  }

  if (this.texture) {
    this.texture = this.texture.toLowerCase().trim();
  }
  next();
});

productSchema.virtual("status").get(function () {
  if (this.quantity === 0) return "out of stock";
  if (this.quantity < 5) return "low stock";
  return "in stock";
});

// Prevent OverwriteModelError
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
