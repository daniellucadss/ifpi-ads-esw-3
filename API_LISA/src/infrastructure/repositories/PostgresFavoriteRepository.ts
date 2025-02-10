import { Pool } from 'pg';
import { Favorite } from '../../domain/entities/Favorite';
import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';

export class PostgresFavoriteRepository implements IFavoriteRepository {
  constructor(private pool: Pool) {}

  async create(favorite: Favorite): Promise<Favorite> {
    const query = `
      INSERT INTO favorites (id, hospital_id, user_id, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      favorite.id,
      favorite.hospitalId,
      favorite.userId,
      favorite.createdAt
    ];

    const result = await this.pool.query(query, values);
    return Favorite.create(result.rows[0]);
  }

  async findById(id: string): Promise<Favorite | null> {
    const query = 'SELECT * FROM favorites WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] ? Favorite.create(result.rows[0]) : null;
  }

  async findByHospitalId(hospitalId: string): Promise<Favorite[]> {
    const query = 'SELECT * FROM favorites WHERE hospital_id = $1';
    const result = await this.pool.query(query, [hospitalId]);
    return result.rows.map(row => Favorite.create(row));
  }

  async findByUserId(userId: string): Promise<Favorite[]> {
    const query = 'SELECT * FROM favorites WHERE user_id = $1';
    const result = await this.pool.query(query, [userId]);
    return result.rows.map(row => Favorite.create(row));
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM favorites WHERE id = $1', [id]);
  }

  async exists(hospitalId: string, userId: string): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM favorites WHERE hospital_id = $1 AND user_id = $2)';
    const result = await this.pool.query(query, [hospitalId, userId]);
    return result.rows[0].exists;
  }
} 