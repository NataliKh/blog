import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT ?? '4000', 10);
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/blog';
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1d';
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

export const env = {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CLIENT_URL
};
