import { GooglePlacesService } from '../../domain/services/GooglePlacesService';
import { Hospital } from '../../domain/entities/Hospital';

export class GetNearbyHospitals {
  private googlePlacesService: GooglePlacesService;

  constructor(googlePlacesService: GooglePlacesService) {
    this.googlePlacesService = googlePlacesService;
  }

  async execute(lat: number, lng: number, radius: number = 5000): Promise<Hospital[]> {
    return await this.googlePlacesService.getNearbyHospitals(lat, lng, radius);
  }
}
