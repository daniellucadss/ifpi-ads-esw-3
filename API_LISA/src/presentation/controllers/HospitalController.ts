import { Request, Response } from 'express';
import { GooglePlacesService } from '../../domain/services/GooglePlacesService';
import { Hospital } from '../../domain/entities/Hospital';

export class HospitalController {
  private googlePlacesService: GooglePlacesService;

  constructor(apiKey: string) {
    this.googlePlacesService = new GooglePlacesService(apiKey);
  }

  async getNearby(req: Request, res: Response): Promise<void> {
    const { lat, lng, radius } = req.query;

    try {
      if (!lat || !lng) {
        res.status(400).json({ error: 'Latitude and longitude are required' });
        return;
      }

      const hospitals = await this.googlePlacesService.getNearbyHospitals(
        parseFloat(lat as string),
        parseFloat(lng as string),
        parseInt(radius as string) || 5000
      );

      res.json(hospitals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Novo endpoint para obter o hospital mais próximo
  async getClosest(req: Request, res: Response): Promise<void> {
    const { lat, lng } = req.query;

    try {
      if (!lat || !lng) {
        res.status(400).json({ error: 'Latitude and longitude are required' });
        return;
      }

      const closestHospital = await this.googlePlacesService.getClosestHospital(
        parseFloat(lat as string),
        parseFloat(lng as string)
      );

      if (!closestHospital) {
        res.status(404).json({ error: 'No hospital found nearby' });
        return;
      }

      res.json(closestHospital);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
