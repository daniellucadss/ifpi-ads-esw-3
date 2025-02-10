import { Request, Response } from 'express';
import { AuthService } from '../../domain/services/AuthService';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;

    try {
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email and password are required' });
        return;
      }

      const user = await this.authService.register(name, email, password);
      res.status(201).json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const token = await this.authService.login(email, password);
      res.json({ token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    try {
      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      await this.authService.resetPassword(email);
      res.json({ message: 'Password reset instructions sent to email' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
} 