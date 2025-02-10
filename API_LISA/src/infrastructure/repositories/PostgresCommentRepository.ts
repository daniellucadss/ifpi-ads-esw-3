import { Pool } from 'pg';
import { Comment } from '../../domain/entities/Comment';
import { ICommentRepository } from '../../domain/repositories/ICommentRepository';

export class PostgresCommentRepository implements ICommentRepository {
  constructor(private pool: Pool) {}

  async create(comment: Comment): Promise<Comment> {
    const query = `
      INSERT INTO comments (id, hospital_id, user_id, text, rating, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      comment.id,
      comment.hospitalId,
      comment.userId,
      comment.text,
      comment.rating,
      comment.createdAt
    ];

    const result = await this.pool.query(query, values);
    return Comment.create(result.rows[0]);
  }

  async findById(id: string): Promise<Comment | null> {
    const query = 'SELECT * FROM comments WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] ? Comment.create(result.rows[0]) : null;
  }

  async findByHospitalId(hospitalId: string): Promise<Comment[]> {
    const query = 'SELECT * FROM comments WHERE hospital_id = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [hospitalId]);
    return result.rows.map(row => Comment.create(row));
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    const query = 'SELECT * FROM comments WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [userId]);
    return result.rows.map(row => Comment.create(row));
  }

  async update(id: string, data: Partial<Comment>): Promise<Comment> {
    const query = `
      UPDATE comments
      SET text = COALESCE($1, text),
          rating = COALESCE($2, rating)
      WHERE id = $3
      RETURNING *
    `;

    const values = [data.text, data.rating, id];
    const result = await this.pool.query(query, values);
    return Comment.create(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM comments WHERE id = $1', [id]);
  }
} 