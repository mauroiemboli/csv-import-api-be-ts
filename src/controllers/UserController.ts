import { NextFunction, Request, Response } from 'express';
import userService from '@Services/UserService';
import { sendResponse } from '@Middleware/responseMiddleware';
class UserController {

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, password, username } = req.body;
            const user = await userService.createUser(firstName, lastName, email, password, username);
            sendResponse(res, { user: user }, 'User created');
        } catch (error) {
            console.log(error);
            next(error);
        }

    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = req.params;
            await userService.deleteUser(parseInt(id));
            sendResponse(res, {}, 'User deleted');
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}

export default new UserController();
