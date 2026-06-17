const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ MONGO_URI not found in .env file'); process.exit(1); }
const PropertySchema = new mongoose.Schema({}, { strict: false });
const Property = mongoose.model('Property', PropertySchema, 'properties');

async function check() {
  await mongoose.connect(MONGO_URI);
  const total = await Property.countDocuments();
  console.log(`Total properties in DB: ${total}`);
  const byStatus = await Property.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  console.log('\nProperties by status:');
  byStatus.forEach(d => console.log(`  "${d._id || 'NO STATUS'}": ${d.count}`));
  await mongoose.disconnect();
}
check().catch(e => console.error('❌', e.message));
