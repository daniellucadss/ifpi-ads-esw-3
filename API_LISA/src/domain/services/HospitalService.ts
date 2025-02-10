import { Hospital, Location } from '../entities/Hospital';
import { IHospitalRepository } from '../repositories/IHospitalRepository';
import { GooglePlacesService } from './GooglePlacesService';

export class HospitalService {
  constructor(
    private hospitalRepository: IHospitalRepository,
    private googlePlacesService: GooglePlacesService
  ) {}

  async getNearbyHospitals(location: Location, radius: number = 5000): Promise<Hospital[]> {
    const hospitals = await this.googlePlacesService.getNearbyHospitals(
      location.lat,
      location.lng,
      radius
    );

    return hospitals;
  }

  async getClosestHospital(location: Location): Promise<Hospital | null> {
    const hospital = await this.googlePlacesService.getClosestHospital(
      location.lat,
      location.lng
    );

    return hospital;
  }
} 