const mongoose = require('mongoose');

// Fasal ki jankari aur recommendation ka schema
const CropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  season: { type: String, required: true }, // Rabi, Kharif, Zaid
  soilType: { type: String, required: true }, // Loamy, Alluvial, Clay
  waterRequirement: { type: String, required: true },
  duration: { type: String, required: true },
  expectedYield: { type: String, required: true },
  costPerAcre: { type: Number, required: true }
});

module.exports = mongoose.model('Crop', CropSchema);