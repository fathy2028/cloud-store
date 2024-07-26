import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js"; // Import the product model

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ message: "Name is required" });
        }
        const existcategory = await categoryModel.findOne({ name });
        if (existcategory) {
            return res.status(200).send({
                success: true,
                message: "Category already exists"
            });
        }
        const category = await categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating category",
            error
        });
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Name is required"
            });
        }
        const category = await categoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating the category",
            error
        });
    }
};

export const getCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).send({
            success: true,
            message: "Categories fetched successfully",
            categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching categories",
            error
        });
    }
};

export const getCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        res.status(200).send({
            success: true,
            message: "Category fetched successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching this category",
            error
        });
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Delete all products related to the category
        await productModel.deleteMany({ category: id });

        // Delete the category
        await categoryModel.findByIdAndDelete(id);
        
        res.status(200).send({
            success: true,
            message: "Category and related products deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to delete category and related products",
            error
        });
    }
};
