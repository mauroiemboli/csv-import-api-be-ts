import AuthController from '@Controllers/AuthController';
import { Router } from 'express';

const router = Router();
/**
 * @swagger
 * /api/authorization/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authorization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Suggested to use midigital@23! as default

 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/login', AuthController.login);
router.post('/validate-token', AuthController.validateToken);


export default router;