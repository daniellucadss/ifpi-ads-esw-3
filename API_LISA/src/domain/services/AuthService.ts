import { User } from '../entities/User';
import { IUserRepository } from '../repositories/IUserRepository';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { randomUUID } from 'crypto';

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private jwtSecret: string
  ) {}

  async register(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await hash(password, 10);
    const user = User.create({
      id: randomUUID(),
      name,
      email,
      password: hashedPassword
    });

    return this.userRepository.create(user);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = sign({ userId: user.id }, this.jwtSecret, { expiresIn: '24h' });
    return token;
  }

  async resetPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    // Implement password reset logic (e.g., send email)
  }
} 