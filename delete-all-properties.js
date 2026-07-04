const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ MONGO_URI not found in .env file'); process.exit(1); }
const PropertySchema = new mongoose.Schema({}, { strict: false });
const Property = mongoose.model('Property', PropertySchema, 'properties');

async function deleteAll() {
  await mongoose.connect(MONGO_URI);

  const before = await Property.countDocuments();
  console.log(`Found ${before} properties in the database.`);

  if (before === 0) {
    console.log('Nothing to delete. Exiting.');
    await mongoose.disconnect();
    return;
  }

  console.log('Deleting all properties...');
  await Property.deleteMany({});

  const after = await Property.countDocuments();
  console.log(`✅ Deleted ${before} properties. ${after} properties remain in database.`);

  await mongoose.disconnect();
}
deleteAll().catch(e => console.error('❌', e.message));
