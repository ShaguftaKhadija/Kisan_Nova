const express = require('express');
const router = express.Router();

// Fasal recommendation API
router.post('/recommend', (req, res) => {
  const { season } = req.body;

  let recommendations = [];
  if (season === 'Rabi') {
    recommendations = [
      {
        crop: 'Wheat (Sharbati / HD-2967)',
        cropHi: 'गेहूँ (शरबती / HD-2967)',
        duration: '115-130 Days',
        expectedYield: '20-22 Quintals / Acre',
        waterNeed: 'Moderate (3-4 irrigations)',
        profitPerAcre: 33000
      },
      {
        crop: 'Mustard (Pusa Bold)',
        cropHi: 'सरसों (पूसा बोल्ड)',
        duration: '105 Days',
        expectedYield: '8-10 Quintals / Acre',
        waterNeed: 'Low (1-2 irrigations)',
        profitPerAcre: 39750
      }
    ];
  } else {
    recommendations = [
      {
        crop: 'Paddy (Basmati 1121)',
        cropHi: 'धान (बासमती 1121)',
        duration: '120-135 Days',
        expectedYield: '22-25 Quintals / Acre',
        waterNeed: 'High',
        profitPerAcre: 41000
      }
    ];
  }

  res.json({ success: true, recommendations });
});

module.exports = router;