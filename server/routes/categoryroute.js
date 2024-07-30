import express from "express"
import { isadmin, requiredsignin } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategoryController, getCategoriesController, getCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router=express.Router();

router.post("/create-category",requiredsignin,isadmin,createCategoryController)


router.put("/update-category/:id",requiredsignin,isadmin,updateCategoryController)

router.get("/getcategories",getCategoriesController)

router.get("/getcategory/:id",getCategoryController)

router.delete("/deletecategory/:id",requiredsignin,isadmin,deleteCategoryController)


export default router;