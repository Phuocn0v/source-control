import User, { IUser } from "../models/user.model";
import ApiError from "../utils/ApiError";
import httpStatus from 'http-status';

const createUser = async (user: IUser) => {
    if (await User.isEmailTaken(user.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
    }

    if (await User.isUsernameTaken(user.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username is already taken');
    }

    if (await User.isPhoneNumberTaken(user.phoneNumber)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number is already taken');
    }

    const newUser = new User(user);
    await newUser.save();
    return newUser;
}

const getUserById = async (id: string) => {
    const user: IUser | null = await User.findById(id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
}

const getUserByEmail = async (email: string) => {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

export default {
    createUser,
    getUserById,
    getUserByEmail
}
