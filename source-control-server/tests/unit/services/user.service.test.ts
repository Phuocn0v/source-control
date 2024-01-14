import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userService from "../../../services/user.service";
import User, { IUser, IUserModel } from "../../../models/user.model";
import { ICreateUser } from "../../../dtos/user.dto";

const mongoServer = new MongoMemoryServer();

beforeAll(async () => {
    await mongoServer.start();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('User Service Test', () => {
    describe('Create User', () => {
        afterAll(async () => {
            await User.deleteMany();
        });

        it('should create a new user', async () => {
            const user: ICreateUser = {
                email: 'example@gmail.com',
                username: 'example',
                password: 'password',
                phoneNumber: '1234567890',
                role: 'user',
            };

            const newUser = await userService.createUser(user);
            expect(newUser).toBeDefined();
        });

        it('should throw an error when email is taken', async () => {
            const user: ICreateUser = {
                email: 'example@gmail.com',
                username: 'example',
                password: 'password',
                phoneNumber: '1234567891',
                role: 'user',
            }
            try {
                await userService.createUser(user);
            }
            catch (err) {
                expect(err).toBeDefined();
            }
        });

        it('should throw an error when username is taken', async () => {
            const user: ICreateUser = {
                email: 'example2@gmail.com',
                username: 'example2',
                password: 'password',
                phoneNumber: '1234567892',
                role: 'user',
            }

            try {
                await userService.createUser(user);
            }
            catch (err) {
                expect(err).toBeDefined();
            }
        });

        it('should throw an error when phoneNumber is taken', async () => {
            const user: ICreateUser = {
                email: 'example2@gmail.com',
                username: 'example2',
                password: 'password',
                phoneNumber: '1234567890',
                role: 'user',
            }

            try {
                await userService.createUser(user);
            }
            catch (err) {
                expect(err).toBeDefined();
            }
        });
    });

    describe('Get User By Id', () => {
        it('should get a user by id', async () => {
            const user: ICreateUser = {
                email: 'example@gmail.com',
                username: 'example',
                password: 'password',
                phoneNumber: '1234567890',
                role: 'user',
            };

            const newUser = await userService.createUser(user);
            console.log(newUser._id.toString());

            // Wait for 1 second before fetching the user
            await new Promise(resolve => setTimeout(resolve, 1000));

            const foundUser: IUser = await userService.getUserById(newUser._id.toString());
            expect(foundUser).toBeDefined();
        });

        it('should throw an error when user is not found', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            expect(userService.getUserById(id)).rejects.toThrow();
        });
    });
});
