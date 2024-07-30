import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import slugify from "slugify";
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Create Product Controller
export const createProductController = [
  upload.single('photo'),
  async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping } = req.body;
      const photo = req.file;

      // Validation
      if (!name) return res.status(400).send({ message: "Name is required" });
      if (!description) return res.status(400).send({ message: "Description is required" });
      if (!price) return res.status(400).send({ message: "Price is required" });
      if (!category) return res.status(400).send({ message: "Category is required" });
      if (!quantity) return res.status(400).send({ message: "Quantity is required" });
      if (!shipping) return res.status(400).send({ message: "Shipping is required" });
      if (!photo) return res.status(400).send({ message: "Photo is required" });

      const product = new productModel({
        name,
        slug: slugify(name),
        description,
        price,
        category,
        quantity,
        shipping,
        photo: req.file.filename
      });

      await product.save();

      res.status(201).send({
        success: true,
        message: "Product created successfully",
        product: {
          ...product._doc,
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in creating product",
        error
      });
    }
  }
];

// Get All Products Controller
export const getallProductController = async (req, res) => {
  try {
    const products = await productModel.find().populate("category").limit(12).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      numproducts: products.length,
      message: "Products fetched successfully",
      products: products.map(product => ({
        ...product._doc,
      }))
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Products cannot be fetched",
      error
    });
  }
};

// Get Single Product Controller
export const getProductController = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findById(id).populate("category", "name");
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    res.status(200).send({
      success: true,
      message: "Product fetched successfully",
      product: {
        ...product._doc,
        photo: undefined // Exclude photo from the main response
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting the product",
      error
    });
  }
};

// Update Product Controller
export const updateProductController = [
  upload.single('photo'),
  async (req, res) => {
    try {
      const id = req.params.id;
      const { name, description, price, category, quantity, shipping } = req.body;
      const photo = req.file;

      const updatedFields = { name, description, price, category, quantity, shipping };

      if (name) {
        updatedFields.slug = slugify(name);
      }

      if (photo) {
        // Remove old photo file if new photo is uploaded
        const product = await productModel.findById(id);
        if (product && product.photo) {
          const oldPhotoPath = path.join('./uploads', product.photo);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }
        updatedFields.photo = req.file.filename;
      }

      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).send({
          success: false,
          message: "Product not found"
        });
      }

      res.status(200).send({
        success: true,
        message: "Product updated successfully",
        product: {
          ...updatedProduct._doc,
          photo: undefined // Exclude photo from the main response
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in updating product",
        error
      });
    }
  }
];

// Delete Product Controller
export const deleteProductController = async (req, res) => {
  try {
    const id = req.params.id;

    // Find and delete the product
    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }

    // Delete the photo file associated with the product
    if (deletedProduct.photo) {
      const photoPath = path.join('./uploads', deletedProduct.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Find and delete orders that include the deleted product
    await orderModel.deleteMany({ products: id });

    res.status(200).send({
      success: true,
      message: "Product and related orders deleted successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting product",
      error
    });
  }
};

// Product Filter Controller
export const productFillterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = { $in: checked }; // Use $in to filter categories
    }
    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] }; // Set price range filter
    }
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering",
      error
    });
  }
};

// Product Count Controller
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error
    });
  }
}

// Product List Controller
export const productListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1
    const products = await productModel.find({}).skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products
    });
  } catch (error) {
    console.log(error)
    res.status500.send({
      success: false,
      message: "Failed to get product page list",
      error
    });
  }
}
// Search Product Controller
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).populate("category");
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in search",
            error
        });
    }
}

// Related Product Controller
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid } // Exclude the current product
        }).limit(4).populate("category");

        if (products) {
            res.status(200).send({
                success: true,
                message: "Fetched successfully",
                products
            });
        } else {
            res.status(404).send({
                success: false,
                message: "No related products found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to get similar products",
            error
        });
    }
};

// Products By Category Controller
export const productsByCategoryController = async (req, res) => {
    try {
        const { id } = req.params; // Get category ID from params
        const products = await productModel.find({ category: id }).populate("category");
        if (!products) {
            return res.status(404).send({
                success: false,
                message: "No products found in this category"
            });
        }
        res.status(200).send({
            success: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting products",
            error
        });
    }
};
