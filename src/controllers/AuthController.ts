import { sendResponse } from '@Middleware/responseMiddleware';
import { NextFunction, Request, Response } from 'express';
import AuthService from '@Services/AuthService';
import UserService from '@Services/UserService';

class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const token = await AuthService.login(email, password);
            const user = await UserService.findByEmail(email);
            sendResponse(res, { authToken: token, authUser: user }, 'User authorized');
        }
        catch (error) {
            next(error);
        }
    }

    async validateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['authorization'];

            const validationResult = await AuthService.validateToken(token as string);

            if (validationResult.isValid) {
                sendResponse(res, { authToken: token, authUser: validationResult.user }, 'Token is valid');
            } else {
                res.status(401).json({ error: 'Token is not valid' });
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();