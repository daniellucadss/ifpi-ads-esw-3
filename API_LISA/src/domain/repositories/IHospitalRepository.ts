import { Hospital, Location } from '../entities/Hospital';

export interface IHospitalRepository {
  findNearby(location: Location, radius: number): Promise<Hospital[]>;
  findClosest(location: Location): Promise<Hospital | null>;
  findById(id: string): Promise<Hospital | null>;
  findByIds(ids: string[]): Promise<Hospital[]>;
} 