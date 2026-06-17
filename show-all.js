const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ MONGO_URI not found in .env file'); process.exit(1); }
const PropertySchema = new mongoose.Schema({}, { strict: false });
const Property = mongoose.model('Property', PropertySchema, 'properties');

async function show() {
  await mongoose.connect(MONGO_URI);
  const props = await Property.find({}, { name: 1, location: 1, status: 1, _id: 0 }).sort({ name: 1 });
  console.log('ALL PROPERTIES IN DB:');
  props.forEach(p => console.log(`  name: "${p.name}" | location: "${p.location}" | status: "${p.status}"`));
  await mongoose.disconnect();
}
show().catch(e => console.error('❌', e.message));
