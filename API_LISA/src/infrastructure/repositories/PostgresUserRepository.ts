import { Pool } from 'pg';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (id, name, email, password, created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [user.id, user.name, user.email, user.password, user.createdAt];
    const result = await this.pool.query(query, values);
    return User.create(result.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] ? User.create(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0] ? User.create(result.rows[0]) : null;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const query = `
      UPDATE users
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          password = COALESCE($3, password)
      WHERE id = $4
      RETURNING *
    `;

    const values = [data.name, data.email, data.password, id];
    const result = await this.pool.query(query, values);
    return User.create(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
} 