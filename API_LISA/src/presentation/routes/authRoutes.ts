import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../../domain/services/AuthService';
import { PostgresUserRepository } from '../../infrastructure/repositories/PostgresUserRepository';
import { pool } from '../../infrastructure/database/connection';

const router = Router();
const userRepository = new PostgresUserRepository(pool);
const authService = new AuthService(userRepository, process.env.JWT_SECRET!);
const authController = new AuthController(authService);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

export default router; 