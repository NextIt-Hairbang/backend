import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

}, { timestamps: true });

// Prevent OverwriteModelError
const Product =
    mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
