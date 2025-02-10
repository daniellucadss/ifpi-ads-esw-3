import { Favorite } from '../entities/Favorite';

export interface IFavoriteRepository {
  create(favorite: Favorite): Promise<Favorite>;
  findById(id: string): Promise<Favorite | null>;
  findByHospitalId(hospitalId: string): Promise<Favorite[]>;
  findByUserId(userId: string): Promise<Favorite[]>;
  delete(id: string): Promise<void>;
  exists(hospitalId: string, userId: string): Promise<boolean>;
} 