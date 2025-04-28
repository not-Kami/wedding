import dotenv from 'dotenv';

dotenv.config();

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@wedding-planner-db-test.xhdmhed.mongodb.net/?retryWrites=true&w=majority&appName=wedding-planner-db-test`;

export default MONGO_URI;

