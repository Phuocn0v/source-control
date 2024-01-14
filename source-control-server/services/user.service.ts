import { ICreateUser } from "../dtos/user.dto";
import User, { IUser, IUserModel } from "../models/user.model";
import ApiError from "../utils/ApiError";
import httpStatus from 'http-status';

async function createUser(user: ICreateUser) {
    if (await User.isEmailTaken(user.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
    }

    if (await User.isUsernameTaken(user.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username is already taken');
    }

    if (await User.isPhoneNumberTaken(user.phoneNumber)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number is already taken');
    }

    const newUser: IUser = new User(user);
    return newUser;
}

async function getUserById(id: string) {
    const user: IUser | null = await User.findOne({ _id: id });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
}

async function getUserByEmail(email: string) {
    const user: IUserModel | null = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

async function updateUserById(userId: string, updateBody: IUser) {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(400, 'Email already taken');
    }

    await User.updateOne({ _id: userId }, updateBody);
    return await getUserById(userId);
}

export default {
    createUser,
    getUserById,
    getUserByEmail,
    updateUserById
}
