import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';
import { PostgresCommentRepository } from '../../infrastructure/repositories/PostgresCommentRepository';
import { pool } from '../../infrastructure/database/connection';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const commentRepository = new PostgresCommentRepository(pool);
const commentController = new CommentController(commentRepository);

router.use(authMiddleware(process.env.JWT_SECRET!));

router.post('/', (req, res) => commentController.create(req, res));
router.get('/hospital/:hospitalId', (req, res) => commentController.getByHospital(req, res));
router.put('/:id', (req, res) => commentController.update(req, res));

export default router; 