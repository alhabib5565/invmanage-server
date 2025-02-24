// getting-started.js
import mongoose from 'mongoose';
import config from './app/config';
import { app } from './app';
async function main() {
  try {
    await mongoose.connect(config.database_url);
    app.listen(config.port, () => {
      console.log(`Invmanage server running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
