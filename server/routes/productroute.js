import express from "express";
import { isadmin, requiredsignin } from './../middlewares/authMiddleware.js';
import { 
  createProductController, 
  deleteProductController, 
  getallProductController, 
  getProductController, 
  getProductPhotoController, 
  productCountController, 
  productFillterController, 
  productListController, 
  productsByCategoryController, 
  relatedProductController, 
  searchProductController, 
  updateProductController
} from "../controllers/productController.js";

const router = express.Router();

router.post("/create-product", requiredsignin, isadmin, createProductController);

router.get("/getall-products", getallProductController);

router.get("/get-product/:id", getProductController);

router.get("/get-product-photo/:id", getProductPhotoController); // New endpoint

router.put("/update-product/:id", requiredsignin, isadmin, updateProductController);

router.delete("/delete-product/:id", requiredsignin, isadmin, deleteProductController);

router.post("/product-fillter", productFillterController);

router.get("/product-count", productCountController);

router.get("/product-list/:page", productListController);

router.get("/search/:keyword", searchProductController);

router.get("/related-product/:pid/:cid", relatedProductController);

router.get("/productsbycategory/:id", productsByCategoryController);

export default router;
