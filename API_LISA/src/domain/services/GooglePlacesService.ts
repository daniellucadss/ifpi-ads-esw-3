import axios from 'axios';
import { Hospital } from '../entities/Hospital';

export class GooglePlacesService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getNearbyHospitals(lat: number, lng: number, radius: number = 5000): Promise<Hospital[]> {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const params = {
      location: `${lat},${lng}`,
      radius,
      type: 'hospital',
      key: this.apiKey,
    };

    try {
      const response = await axios.get(url, { params });
      const data = response.data as { results: any[] };

      const hospitals = data.results.map((place: any) => new Hospital(
        place.place_id,
        place.name || 'Nome não disponível',
        place.vicinity || 'Endereço não disponível',
        place.geometry.location.lat,
        place.geometry.location.lng
      ));

      return hospitals;
    } catch (error: any) {
      throw new Error('Failed to fetch data from Google Places API');
    }
  }

  // Nova função para retornar o hospital mais próximo
  async getClosestHospital(lat: number, lng: number): Promise<Hospital | null> {
    const hospitals = await this.getNearbyHospitals(lat, lng);
    if (hospitals.length === 0) return null;

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Raio da Terra em km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distância em km
    };

    let closestHospital = hospitals[0];
    let minDistance = getDistance(lat, lng, closestHospital.latitude, closestHospital.longitude);

    hospitals.forEach(hospital => {
      const distance = getDistance(lat, lng, hospital.latitude, hospital.longitude);
      if (distance < minDistance) {
        closestHospital = hospital;
        minDistance = distance;
      }
    });

    return closestHospital;
  }
}
