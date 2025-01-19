import { Router } from 'express';
import { HospitalController } from '../controllers/HospitalController';

const router = Router();
if (!process.env.GOOGLE_API_KEY) {
    console.error('API Key is missing in the environment variables.');
    process.exit(1); // Encerra o processo se a chave estiver faltando
}
  
const hospitalController = new HospitalController(process.env.GOOGLE_API_KEY);
  
// Rota para retornar todos os hospitais próximos
router.get('/nearby', (req, res) => hospitalController.getNearby(req, res));

// Rota para retornar o hospital mais próximo
router.get('/closest', (req, res) => hospitalController.getClosest(req, res));

export default router;