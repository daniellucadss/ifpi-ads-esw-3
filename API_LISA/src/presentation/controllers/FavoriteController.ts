import { Request, Response } from 'express';
import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';
import { Favorite } from '../../domain/entities/Favorite';
import { randomUUID } from 'crypto';

export class FavoriteController {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  async create(req: Request, res: Response): Promise<void> {
    const { hospitalId } = req.body;
    const userId = req.user?.id;

    try {
      if (!hospitalId || !userId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const exists = await this.favoriteRepository.exists(hospitalId, userId);
      if (exists) {
        res.status(400).json({ error: 'Hospital already in favorites' });
        return;
      }

      const favorite = Favorite.create({
        id: randomUUID(),
        hospitalId,
        userId
      });

      const created = await this.favoriteRepository.create(favorite);
      res.status(201).json(created);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserFavorites(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;

    try {
      const favorites = await this.favoriteRepository.findByUserId(userId!);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
      const favorite = await this.favoriteRepository.findById(id);
      if (!favorite) {
        res.status(404).json({ error: 'Favorite not found' });
        return;
      }

      if (favorite.userId !== userId) {
        res.status(403).json({ error: 'Not authorized' });
        return;
      }

      await this.favoriteRepository.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
} 