import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../../models/user.model';
import { faker } from '@faker-js/faker';

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

describe('User Model Test', () => {
    afterEach(async () => {
        await User.deleteMany({});
    });

    it('isEmailTaken should return false when email is not taken', async () => {
        const emailNotTaken = 'test@example.com';
        const _id = new mongoose.Types.ObjectId().toString();
        const result = await User.isEmailTaken(emailNotTaken, _id);
        expect(result).toBe(false);
    });

    it('isEmailTaken should return true when email is taken', async () => {
        const emailTaken = 'taken@example.com';
        let _id = new mongoose.Types.ObjectId().toString();
        const user = new User({ _id, email: emailTaken, username: 'test', password: 'password', phoneNumber: '1234567890', role: 'user', isEmailVerified: false });
        await user.save();

        _id = new mongoose.Types.ObjectId().toString();
        const result = await User.isEmailTaken(emailTaken, _id);
        expect(result).toBe(true);
    });

    it('isUsernameTaken should return false when username is not taken', async () => {
        const usernameNotTaken = 'test';
        const _id = new mongoose.Types.ObjectId().toString();
        const result = await User.isUsernameTaken(usernameNotTaken, _id);
        expect(result).toBe(false);
    });

    it('isUsernameTaken should return true when username is taken', async () => {
        const usernameTaken = 'taken';
        let _id = new mongoose.Types.ObjectId().toString();
        const user = new User({
            _id, email: faker.internet.email(), username: usernameTaken, password: 'password', phoneNumber: '1234567890', role: 'user', isEmailVerified: false
        });
        await user.save();

        _id = new mongoose.Types.ObjectId().toString();
        const result = await User.isUsernameTaken(usernameTaken, _id);
        expect(result).toBe(true);
    });

    it('isPhoneNumberTaken should return false when phoneNumber is not taken', async () => {
        const phoneNumberNotTaken = '1234567890';
        const _id = new mongoose.Types.ObjectId().toString();
        const result = await User.isPhoneNumberTaken(phoneNumberNotTaken, _id);
        expect(result).toBe(false);
    });

    it('isPhoneNumberTaken should return true when phoneNumber is taken', async () => {
        const phoneNumberTaken = '1234567890';
        let _id = new mongoose.Types.ObjectId().toString();
        const user = new User({
            _id, email: faker.internet.email(), username: 'test', password: 'password', phoneNumber: phoneNumberTaken, role: 'user', isEmailVerified: false
        });
        await user.save();

        _id = new mongoose.Types.ObjectId().toString();
        const result = await User.isPhoneNumberTaken(phoneNumberTaken, _id);
        expect(result).toBe(true);
    });
});
