import mongoose, { Model } from "mongoose";
import toJson from "./plugins/toJson";

export interface IUser {
    _id: mongoose.Schema.Types.ObjectId;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    role: string;
    isEmailVerified: boolean;
}

interface IUserModel extends Model<IUser> {
    isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
    isUsernameTaken(username: string, excludeUserId?: string): Promise<boolean>;
    isPhoneNumberTaken(phoneNumber: string, excludeUserId?: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
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

userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
}

userSchema.statics.isUsernameTaken = async function (username: string, excludeUserId?: string) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    return !!user;
}

userSchema.statics.isPhoneNumberTaken = async function (phoneNumber: string, excludeUserId?: string) {
    const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
    return !!user;
}

const User: IUserModel = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
