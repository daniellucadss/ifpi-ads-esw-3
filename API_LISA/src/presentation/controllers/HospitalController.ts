import { Request, Response } from 'express';
import { HospitalService } from '../../domain/services/HospitalService';
import { Location } from '../../domain/entities/Hospital';

export class HospitalController {
  constructor(private hospitalService: HospitalService) {}

  async getNearby(req: Request, res: Response): Promise<void> {
    const { lat, lng, radius } = req.query;

    try {
      if (!lat || !lng) {
        res.status(400).json({ error: 'Latitude and longitude are required' });
        return;
      }

      const location: Location = {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string)
      };

      const hospitals = await this.hospitalService.getNearbyHospitals(
        location,
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

      const location: Location = {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string)
      };

      const hospital = await this.hospitalService.getClosestHospital(location);

      if (!hospital) {
        res.status(404).json({ error: 'No hospital found nearby' });
        return;
      }

      res.json(hospital);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
