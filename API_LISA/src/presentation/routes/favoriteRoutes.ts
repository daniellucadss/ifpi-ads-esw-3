import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { PostgresFavoriteRepository } from '../../infrastructure/repositories/PostgresFavoriteRepository';
import { pool } from '../../infrastructure/database/connection';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const favoriteRepository = new PostgresFavoriteRepository(pool);
const favoriteController = new FavoriteController(favoriteRepository);

router.use(authMiddleware(process.env.JWT_SECRET!));

router.post('/', (req, res) => favoriteController.create(req, res));
router.get('/user', (req, res) => favoriteController.getUserFavorites(req, res));
router.delete('/:id', (req, res) => favoriteController.delete(req, res));

export default router; 