import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    customerId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,
        required: true
    }
}, { timestamps: true }) // <-- Add timestamps here

export default mongoose.model("users", userSchema, "users")