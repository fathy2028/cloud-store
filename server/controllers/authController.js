import { comparepassword, hashpassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import jwt from "jsonwebtoken"
export const registerController= async(req,res)=>{
try {
    const {name,email,password,phone,address,answer} = req.body;
    
    if(!name){
    return  res.send({message:"name is required"})
    }
    if(!email){
    return  res.send({message:"email is required"})
    }
    if(!password){
    return  res.send({message:"password is required"})
    }
    if(!phone){
    return  res.send({message:"phone is required"})
    }
    if(!address){
    return  res.send({message:"address is required"})
    }
    if(!answer){
    return  res.send({message:"answer is required"})
    }

   const existinguser=await userModel.findOne({email})
    if(existinguser){
        return res.status(200).send({
            success:false,
            message:"already registered please login"
        })
    }
    const hashed= await hashpassword(password);
    const hashAnswer= await hashpassword(answer);
    const user=await new userModel({name,email,password:hashed,phone,address,answer:hashAnswer}).save();
    res.status(201).send({
        success:true,
        message:"user registered successfully",
        user
    })
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"error in register",
        error
    })
}
}

//login

export const loginController=async (req,res)=>{
try {
    const {email,password}=req.body;
    if(!email || !password){
     return res.status(404).send({
            success:false,
            message:"invalid email or password"
        })
    }
    const user= await userModel.findOne({email});
    if(!user){
     return res.status(404).send({
            success:false,
            message:"this email is not found",
        })
    }
    const match=await comparepassword(password,user.password);
    if(!match){
        return res.status(404).send({
            success:false,
            message:"password is incorrect"
        })
    }
    const token=await jwt.sign({_id:user._id},process.env.JWT_KEY);
    return res.status(200).send({
        success:true,
        message:"logedin successfully",
        user,
        token
    })
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"error in login",
        error
    })
}
}

export const testController=async(req,res)=>{
res.send("protected routes");
}

export const forgotpasswordController = async (req, res) => {
    try {
        const { email, answer, newpassword } = req.body;

        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }
        if (!answer) {
            return res.status(400).send({ message: "Answer is required" });
        }
        if (!newpassword) {
            return res.status(400).send({ message: "Password is required" });
        }

        const user = await userModel.findOne({email});
        const match=await comparepassword(answer,user.answer);
        if (!user&&!match) {
            return res.status(400).send({
                success: false,
                message: "Wrong email or answer"
            });
        }

        const hash = await hashpassword(newpassword);
        await userModel.findByIdAndUpdate(user._id, { password: hash });

        res.status(200).send({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
};

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        const user = await userModel.findById(req.user._id);

        if (password && password.length < 6) {
            return res.json({ error: "Password is required and must be at least 6 characters long" });
        }

        const hashedPassword = password ? await hashpassword(password) : undefined;
        const hashedAnswer = answer ? await hashpassword(answer) : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                email: email || user.email,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
                answer: hashedAnswer || user.answer
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating profile",
            error
        });
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send({
            success: true,
            users
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching users",
            error
        });
    }
};

export const deleteUserController = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
  
      // Delete associated orders
      await orderModel.deleteMany({ user: userId });
  
      // Delete the user
      await userModel.findByIdAndDelete(userId);
  
      res.status(200).send({
        success: true,
        message: "User and associated orders deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error deleting user",
        error,
      });
    }
  };

export const searchUsersController = async (req, res) => {
    try {
        const { name } = req.query;
        const users = await userModel.find({
            name: { $regex: name, $options: 'i' }
        });
        res.status(200).send({
            success: true,
            users
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error searching users",
            error
        });
    }
};

export const updateUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, password, phone, address, answer } = req.body;

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        // Validate and hash new password if provided
        const hashedPassword = password ? await hashpassword(password) : user.password;
        const hashedAnswer = answer ? await hashpassword(answer) : user.answer;

        // Update user details
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                name: name || user.name,
                email: email || user.email,
                password: hashedPassword,
                phone: phone || user.phone,
                address: address || user.address,
                answer: hashedAnswer
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "User updated successfully",
            updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating user",
            error
        });
    }
};