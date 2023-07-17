import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { IGetUserAuthInfoRequest } from 'src/utils/interfaces';

export function authenticateToken(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.userId = user.userId;
        next();
    });
}

