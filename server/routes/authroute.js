import express from "express";
import { 
    registerController, 
    loginController, 
    testController, 
    forgotpasswordController, 
    updateProfileController,
    getAllUsersController,
    deleteUserController,
    searchUsersController,
    updateUserController // new
} from "../controllers/authController.js";

import { isadmin, requiredsignin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Existing routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgotpassword", forgotpasswordController);
router.get("/test", requiredsignin, isadmin, testController);
router.get("/user-auth", requiredsignin, (req, res) => {
    res.status(200).send({ ok: true });
});
router.get("/admin-auth", requiredsignin, isadmin, (req, res) => {
    res.status(200).send({ ok: true });
});
router.put("/updateuserprofile", requiredsignin, updateProfileController);

// New routes for admin to manage users
router.get("/users", requiredsignin, isadmin, getAllUsersController);
router.delete("/users/:userId", requiredsignin, isadmin, deleteUserController);
router.get("/users/search", requiredsignin, isadmin, searchUsersController);
router.put("/users/:userId", requiredsignin, isadmin, updateUserController);

export default router;
