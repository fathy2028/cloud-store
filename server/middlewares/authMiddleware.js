import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const requiredsignin = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized access. No token provided.',
            });
        }

        const decode = await jwt.verify(token, process.env.JWT_KEY);
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success: false,
            message: 'Unauthorized access. Invalid token.',
            error: error.message,
        });
    }
};

export const isadmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized access. Admin only.',
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({
            success: false,
            message: 'Error in admin middleware',
            error: error.message,
        });
    }
};
