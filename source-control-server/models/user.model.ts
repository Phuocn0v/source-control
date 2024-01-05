import mongoose from "mongoose";
import toJson from "./plugins/toJson";

export interface User {
    _id: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    role: string;
    isEmailVerified: boolean;
}

const userSchema = new mongoose.Schema<User>({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },
    isEmailVerified: {
        type: Boolean,
        required: true,
        default: false
    }
})

userSchema.plugin(toJson);

export default mongoose.model<User>("User", userSchema);
