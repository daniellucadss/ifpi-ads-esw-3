import { Comment } from '../entities/Comment';

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
  findById(id: string): Promise<Comment | null>;
  findByHospitalId(hospitalId: string): Promise<Comment[]>;
  findByUserId(userId: string): Promise<Comment[]>;
  update(id: string, data: Partial<Comment>): Promise<Comment>;
  delete(id: string): Promise<void>;
} 