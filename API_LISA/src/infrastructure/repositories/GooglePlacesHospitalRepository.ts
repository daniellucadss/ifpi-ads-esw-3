import { Hospital, Location } from '../../domain/entities/Hospital';
import { IHospitalRepository } from '../../domain/repositories/IHospitalRepository';
import { GooglePlacesService } from '../../domain/services/GooglePlacesService';

export class GooglePlacesHospitalRepository implements IHospitalRepository {
  constructor(private googlePlacesService: GooglePlacesService) {}

  async findNearby(location: Location, radius: number): Promise<Hospital[]> {
    const hospitals = await this.googlePlacesService.getNearbyHospitals(
      location.lat,
      location.lng,
      radius
    );
    return hospitals;
  }

  async findClosest(location: Location): Promise<Hospital | null> {
    const hospital = await this.googlePlacesService.getClosestHospital(
      location.lat,
      location.lng
    );
    return hospital;
  }

  async findById(id: string): Promise<Hospital | null> {
    // Implement using Google Places Details API
    throw new Error('Method not implemented.');
  }

  async findByIds(ids: string[]): Promise<Hospital[]> {
    // Implement using Google Places Details API
    throw new Error('Method not implemented.');
  }
} 