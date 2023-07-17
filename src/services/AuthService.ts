
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRepository } from '@Repository/UserRepository';
import { AppError } from '@Errors/AppError';
import UserService from './UserService';
import { decode } from 'punycode';

class AuthService {
    async login(email: string, password: string) {

        const user = await UserRepository.findOne({ where: { email } });
        if (!user) {
            throw new AppError('User not found');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new AppError('Password not valid');
        }

        const payload = { userId: user.id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '24h' });

        return token;
    }

    async validateToken(token: string) {
        try {
            const tokenClean = token.replace('Bearer ', '');
            const decoded = jwt.verify(tokenClean, process.env.JWT_SECRET || 'your_secret_key');

            if (typeof decoded === 'object' && 'email' in decoded) {
                const user = await UserService.findByEmail((decoded as JwtPayload).email);
                if (user) {
                    return { isValid: true, user };
                }
            }

            return { isValid: false, user: null };

        } catch (error) {
            return { isValid: false, user: null };
        }
    }


}

export default new AuthService();