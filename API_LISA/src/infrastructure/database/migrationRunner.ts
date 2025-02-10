import { Pool } from 'pg';
import * as createTables from './migrations/001_create_tables';

export async function runMigrations(pool: Pool): Promise<void> {
  try {
    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if migration was already executed
    const result = await pool.query(
      'SELECT * FROM migrations WHERE name = $1',
      ['001_create_tables']
    );

    if (result.rows.length === 0) {
      // Run migration
      await createTables.up(pool);

      // Record migration execution
      await pool.query(
        'INSERT INTO migrations (name) VALUES ($1)',
        ['001_create_tables']
      );

      console.log('Migration 001_create_tables executed successfully');
    } else {
      console.log('Migration 001_create_tables already executed');
    }
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
} 