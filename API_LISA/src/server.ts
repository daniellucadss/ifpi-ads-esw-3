import dotenv from 'dotenv';
dotenv.config();

console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY);

import express from 'express';
import cors from 'cors';
import hospitalRoutes from './presentation/routes/hospitalRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/hospitals', hospitalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
