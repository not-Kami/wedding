//import dotenv
import dotenv from 'dotenv';
dotenv.config(); 
import app from './src/config/app.config.js';

const port = process.env.PORT || 3000;

// The app is already configured with CORS and express.json() in app.config.js
// No need to apply middleware again here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});