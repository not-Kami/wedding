import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

<<<<<<< HEAD
=======
// Export environment variables
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wedding-planner';
export const JWT_SECRET = process.env.JWT_SECRET || 'wedding_planner_jwt_secret_key_2024';
export const PORT = process.env.PORT || 3000;

>>>>>>> e96b766 (improved basic component & navigation)
export default dotenv;