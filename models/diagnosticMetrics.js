import mongoose from 'mongoose';

const DiagnosticMetrics = new mongoose.Schema({
  name: { type: String },
  oru_sonic_codes: { type: String },
  oru_sonic_units: { type: String },
  units: { type: String },
  min_age: { type: Number },
  max_age: { type: Number },
  gender: { type: String },
  standard_lower: { type: Number },
  standard_higher: { type: Number },
  everlab_lower: { type: Number },
  everlab_higher: { type: Number },
}, {
  strict: false,
  timestamps: true
});

export default mongoose.model('diagnosticMetrics', DiagnosticMetrics, 'diagnosticMetrics');
