import { AppError } from '@Errors/AppError';
import { sendResponse } from '@Middleware/responseMiddleware';
import ProductService from '@Services/ProductService';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { IGetUserAuthInfoRequest } from 'src/utils/interfaces';

const upload = multer({ dest: 'uploads/' });

class ProductController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await ProductService.findAll();
            sendResponse(res, products, 'All products');
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async upload(req: Request, res: Response, next: NextFunction) {
        upload.single('file')(req, res, async (err: any) => {

            if (err) {
                return next(err);
            }
            try {
                const file: Express.Multer.File | undefined = req.file;
                const requestAuth: IGetUserAuthInfoRequest = req;
                const userId = requestAuth.userId;
                if (userId) {
                    const result = await ProductService.processFile(file, userId);
                    sendResponse(res, result, 'File processed successfully');
                }
                else throw new AppError("Missing userId")

            } catch (error) {
                console.log(error);
                next(error);
            }
        });
    }

}

export default new ProductController();
