import { User } from '@Entity/User';
import { AppError } from '@Errors/AppError';
import AuthenticationHelper from '@Helpers/AuthenticationHelper';
import { UserRepository } from '@Repository/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
    async findByEmail(email: string) {
        const user = await UserRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User not found');
        }
        return user;
    }

    async createUser(firstName: string, lastName: string, email: string, password: string, username: string) {
        const userExists = await UserRepository.userExists(email);
        if (userExists) {
            throw new AppError('User with the provided email already exists');
        }

        if (!AuthenticationHelper.validatePassword(password)) throw new AppError('Password must contain at least one lowercase, one uppercase, one number, one special character, and be at least 8 characters long');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = hashedPassword;
        user.username = username;

        const savedUser = await UserRepository.save(user);

        return savedUser;
    }



    async deleteUser(id: number) {

        const user = await UserRepository.findOne({ where: { id: id } });
        if (!user) {
            throw new Error('User not found');
        }

        await UserRepository.remove(user);

        return { message: 'User deleted successfully' };
    }

    private async generateToken(user: User) {
        const payload = { userId: user.id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '24h' });
        return token;
    }

}

export default new UserService();