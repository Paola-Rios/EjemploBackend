
const Product = require("../models/Product");
const CartProduct = require("../models/CartProduct");
const Cart = require("../models/Cart");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.addCart = catchAsync(async (req, res) => {
  const user = req.user;
  
  //Validamos si el producto existe
  const product = await Product.findById(req.body.ProductId);
  if(!product) {
    res.status(404).json({
      status: "Product not found.",
    });
    return;
  }

  //validamos cantidad
  const cantidad = req.body.Cantidad;
  if(cantidad < 1){
    res.status(404).json({
      status: "Quantity cannot be less than 0.",
    });
    return;
  }

  //Agregar un nuevo cart si no existe
  let cart = await Cart.findOne({userId: user.id, status: false});
  if(!cart) {
    cart = await Cart.create({
              userId: user.id, 
              status: false
            });
  }

  let cartProduct = await CartProduct.findOne({productId: req.body.ProductId, cartId: cart.id});
  console.log(cartProduct);

  if(!cartProduct){
    cartProduct = await CartProduct.create({
      productId: req.body.ProductId, 
      cartId: cart.id, 
      cantidad: req.body.Cantidad
    });
  } else {
    cartProduct.cantidad = req.body.Cantidad;
    cartProduct.save();
  }

  res.status(200).json({
    status: "success",
    data: {
       cart: cart,
    },
  });
});


exports.deleteProduct = catchAsync(async (req, res) => {

  //Validamos si el cart ya existe
  const user = req.user;
  let cart = await Cart.findOne({userId: user.id, status: false});
  if(!cart){
    res.status(200).json({
      status: "success",
      message: "Error. No hay carrito para el usuario."
    });
  } else {
    let product = await CartProduct.findOne({productId: req.params.id, cartId: cart.id});
    if(!product){
      res.status(200).json({
        status: "success",
        message: "Info. El producto no estaba en el cart."
      });
    } else {
      product.deleteOne();
      res.status(200).json({
        status: "success",
        data: product,
        message: "Info. El producto fue eliminado."
      });
    }
  }
});

exports.payCart = catchAsync(async (req, res) => {

  //Validamos si el cart ya existe
  const user = req.user;

  //Agregar un nuevo cart si no existe
  let cart = await Cart.findOne({userId: user.id, status: false});
  if(cart) {
    cart.status = true;
    cart.save();
    res.status(200).json({
      status: "success",
      message: `El carrito fue pagado correctamente.`
    });
  } else {
    res.status(400).json({
      status: "success",
      message: "No existe un carrito pendiente para el usuario."
    });
  }
});


