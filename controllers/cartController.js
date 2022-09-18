
const Product = require("../models/Product");
const CartProduct = require("../models/CartProduct");
const Cart = require("../models/Cart");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.addCart = catchAsync(async (req, res) => {
  const user = req.user;
  
  //Validamos si el producto existe
  const product = Product.findById(req.body.ProductId);
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

  //Validamos si el cart ya existe
  let cart = null;
  let isOldCart = false;
  Cart.findOne({userId: user.id, status: false}, function(err, docs) {
    if (!err) {
      cart = docs;
      isOldCart = true;
    }
  });

  //Agregar un nuevo cart si no existe
  if(!cart) {
    cart = await Cart.create({
      UserId: user.id, 
      status : false
    });
  }

  if(isOldCart) {
    //Buscar si el producto existe y modificarlo
    CartProduct.findOne({productId: req.body.ProductId, cartId: cart.id} , function(err, docs) {
      if (err) {
        CartProduct.create({
          productId: req.body.ProductId, 
          cartId: cart.id, 
          cantidad: req.body.Cantidad
        });
      } else {
        let cartProduct = CartProduct.findById(docs.id);
        cartProduct.cantidad = req.body.Cantidad;
        cartProduct.save();
      }
    })
  } else {
    //Solo añadir el producto
    CartProduct.create({
      productId: req.body.ProductId, 
      cartId: cart.id, 
      cantidad: req.body.Cantidad
    });
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
  let cart = null;
  const user = req.user;
  Cart.findOne({userId: user.id, status: false}, function(err, docs) {
    if (err) {
      res.status(404).json({
        status: "No existe un carrito para el usuario.",
      });
      return;
    } else {
      cart = docs;
    }
  });

  //ver si existe el producto
  //Buscar si el producto existe y modificarlo
  CartProduct.findOneAndDelete({productId: req.params.id, cartId: cart.id} , function(err, docs) {
    if (err) {
      console.log("Error: el producto no existe.");
      console.log(err);

      res.status(200).json({
        status: "success",
        message: `El producto con id {req.params.id} no existia en el carrito.`
      });
    } else {
      console.log(`El producto con id {req.params.id} fue borrado del carrito.`);
      res.status(200).json({
        status: "success",
        message: `El producto con id {req.params.id} fue borrado del carrito.`
      });
    }
  });
});

exports.payCart = catchAsync(async (req, res) => {

  //Validamos si el cart ya existe
  let cart = null;
  const user = req.user;
  Cart.findOne({userId: user.id, status: false}, function(err, docs) {
    if (err) {
      res.status(404).json({
        status: "No existe un carrito para el usuario.",
      });
      return;
    } else {
      cart = docs;
    }
  });

  if(cart){
    let paidCart = await Cart.findById(cart.id)
    paidCart.status = true;
    paidCart.save();

    //TODO: calcular el costo total del carrito y devolver.

    res.status(200).json({
      status: "success",
      message: `El carrito fue pagado correctamente.`
    });
  } 
});


