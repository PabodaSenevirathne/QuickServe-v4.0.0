const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');


// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    }
  });
  
  // Create multer instance with the specified configuration
  const upload = multer({ storage: storage });

// POST a new product with image upload
router.post('/', upload.single('image'), async (req, res) => {
    const { productId, description, price, shippingCost } = req.body;
    const imagePath = req.file.path; // Get the path of the uploaded image file
  
    try {
      let product = await Product.findOne({ productId });
      if (product) {
        return res.status(400).json({ msg: 'Product already exists' });
      }
  
      product = new Product({
        productId,
        description,
        image: imagePath, // Save the image path in the database
        price,
        shippingCost
      });
  
      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // GET all products with image data
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      const productsWithImages = [];
      
      // Read image files and convert them to base64 data
      for (const product of products) {
        const imagePath = path.join(__dirname, '..', product.image);
        const imageData = fs.readFileSync(imagePath);
        const base64Image = Buffer.from(imageData).toString('base64');
        productsWithImages.push({ ...product._doc, image: `data:image/jpeg;base64,${base64Image}` });
      }
      
      res.json(productsWithImages);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // GET a single product by ID with image data
  router.get('/:productId', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.productId });
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
  
      const imagePath = path.join(__dirname, '..', product.image);
      const imageData = fs.readFileSync(imagePath);
      const base64Image = Buffer.from(imageData).toString('base64');
      const productWithImage = { ...product._doc, image: `data:image/jpeg;base64,${base64Image}` };
      
      res.json(productWithImage);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  



// // GET all products
// router.get('/', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });






// // GET a single product by ID
// router.get('/:productId', async (req, res) => {
//     try {
//         const product = await Product.findOne({ productId: req.params.productId });
//         if (!product) {
//             return res.status(404).json({ msg: 'Product not found' });
//         }
//         res.json(product);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });




// // POST a new product
// router.post('/', async (req, res) => {
//     const { productId, description, image, price, shippingCost } = req.body;

//     try {
//         let product = await Product.findOne({ productId });
//         if (product) {
//             return res.status(400).json({ msg: 'Product already exists' });
//         }

//         product = new Product({
//             productId,
//             description,
//             image,
//             price,
//             shippingCost
//         });

//         await product.save();
//         res.json(product);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// PUT (update) a product
router.put('/:productId', async (req, res) => {
    const { description, image, price, shippingCost } = req.body;

    try {
        let product = await Product.findOne({ productId: req.params.productId });

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        product.description = description;
        product.image = image;
        product.price = price;
        product.shippingCost = shippingCost;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE a product
router.delete('/:productId', async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ productId: req.params.productId });

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

