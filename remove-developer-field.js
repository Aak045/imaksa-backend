// remove-developer-field.js
// One-time cleanup: strips the legacy "developer" field from every
// property document in the database, since the developer feature
// has been fully removed from the site, admin panel, and schema.
//
// Run this once: node remove-developer-field.js

const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ MONGO_URI not found in .env file'); process.exit(1); }

const PropertySchema = new mongoose.Schema({}, { strict: false });
const Property = mongoose.model('Property', PropertySchema, 'properties');

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const before = await Property.countDocuments({ developer: { $exists: true } });
  console.log(`Found ${before} properties with a leftover "developer" field`);

  if (before === 0) {
    console.log('Nothing to clean. Database is already free of the developer field.');
    await mongoose.disconnect();
    return;
  }

  const result = await Property.updateMany(
    { developer: { $exists: true } },
    { $unset: { developer: '' } }
  );

  console.log(`✅ Removed "developer" field from ${result.modifiedCount} properties`);

  const remaining = await Property.countDocuments({ developer: { $exists: true } });
  console.log(`📊 Properties still with "developer" field: ${remaining}`);

  await mongoose.disconnect();
  console.log('\n🎉 Done. Database is now fully clean of the developer field.');
}

run().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
