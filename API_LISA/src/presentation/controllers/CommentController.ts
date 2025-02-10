import { Request, Response } from 'express';
import { ICommentRepository } from '../../domain/repositories/ICommentRepository';
import { Comment } from '../../domain/entities/Comment';
import { randomUUID } from 'crypto';

export class CommentController {
  constructor(private commentRepository: ICommentRepository) {}

  async create(req: Request, res: Response): Promise<void> {
    const { hospitalId, text, rating } = req.body;
    const userId = req.user?.id; // Assuming middleware sets user

    try {
      if (!hospitalId || !text || !rating || !userId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const comment = Comment.create({
        id: randomUUID(),
        hospitalId,
        userId,
        text,
        rating,
      });

      const created = await this.commentRepository.create(comment);
      res.status(201).json(created);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByHospital(req: Request, res: Response): Promise<void> {
    const { hospitalId } = req.params;

    try {
      const comments = await this.commentRepository.findByHospitalId(hospitalId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { text, rating } = req.body;
    const userId = req.user?.id;

    try {
      const comment = await this.commentRepository.findById(id);
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      if (comment.userId !== userId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      const updated = await this.commentRepository.update(id, { text, rating });
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
} 