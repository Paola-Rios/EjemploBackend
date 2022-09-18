const mongoose = require("mongoose");
const cartProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  cartId: {
    type: String,
    required: true,
    unique: true,
  },
  cantidad: {
    type: Number,
    required: true,
  }
});

const CartProduct = mongoose.model("CartProduct", cartProductSchema);
module.exports = CartProduct;
