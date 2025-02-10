import dotenv from 'dotenv';
dotenv.config();

console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY);

import express from 'express';
import cors from 'cors';
import hospitalRoutes from './presentation/routes/hospitalRoutes';
import authRoutes from './presentation/routes/authRoutes';
import commentRoutes from './presentation/routes/commentRoutes';
import favoriteRoutes from './presentation/routes/favoriteRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/hospitals', hospitalRoutes);
app.use('/auth', authRoutes);
app.use('/comments', commentRoutes);
app.use('/favorites', favoriteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
