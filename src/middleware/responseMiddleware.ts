import { Response } from 'express';

export const sendResponse = (res: Response, data: any, message = 'Success', status = 200) => {
  res.status(status).json({
    status: 'success',
    message: message,
    data: data,
  });
};
