
const Product = require("../models/Product");
const CartProduct = require("../models/CartProduct");
const Cart = require("../models/Cart");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    status: "success",
    timeOfRequest: req.requestTime,
    results: products.length,
    data: {
      products,
    },
  });
});

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
  if(cantidad < 0){
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

exports.getProductById = catchAsync(async (req, res) => {
  const foundProduct = await Product.findById(req.params.id);
  if (foundProduct) {
    res.status(200).json({
      status: "success",
      data: {
        product: foundProduct,
      },
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }
});

exports.updateProduct = catchAsync(async (req, res) => {
  const foundProduct = await Product.findById(req.params.id);
  if(foundProduct) {
    const updatedProduct = req.body;
    foundProduct.productName = updatedProduct.productName;
    foundProduct.price = updatedProduct.price;
    foundProduct.description = updatedProduct.description;
    foundProduct.save();

    res.status(200).json({
      status: "success",
      data: {
        product: foundProduct,
      },
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }

});

exports.deleteProduct = catchAsync(async (req, res) => {
  const foundProduct = await Product.findById(req.params.id);
  if(foundProduct) {
   foundProduct.deleteOne();

    res.status(200).json({
      status: "success",
      data: {
        product: foundProduct,
      },
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }

});


