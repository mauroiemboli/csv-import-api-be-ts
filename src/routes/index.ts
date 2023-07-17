import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import { authenticateToken } from '@Middleware/authMiddleware';

const router = Router();

// Public routes
router.use('/authorization', authRoutes);

// Private routes that require a valid JWT to access
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
router.use(authenticateToken); // Apply the JWT middleware
router.use('/products', productRoutes);
router.use('/users', userRoutes);



export default router;
