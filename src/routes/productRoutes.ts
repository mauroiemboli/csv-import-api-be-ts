import { Router } from 'express';
import ProductController from '@Controllers/ProductController';

const router = Router();

router.get('/', ProductController.getAll);
router.post('/upload', ProductController.upload);


export default router;