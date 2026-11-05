import express from 'express';
import path from 'path';
import { testConnection } from './db';
import cardRoutes from './routes/cards';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Debug logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api/cards', cardRoutes);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await testConnection().catch(console.error);
});