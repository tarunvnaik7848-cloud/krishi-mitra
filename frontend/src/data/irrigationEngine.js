/**
 * AI Irrigation recommendation engine.
 * Rule-based system that simulates what an ML model would output.
 */

const cropWaterNeeds = {
  rice:       { base: 6000, critical: ['seedling', 'flowering'] },
  wheat:      { base: 2500, critical: ['flowering', 'fruiting'] },
  cotton:     { base: 3500, critical: ['flowering', 'fruiting'] },
  sugarcane:  { base: 8000, critical: ['vegetative', 'fruiting'] },
  tomato:     { base: 3000, critical: ['flowering', 'fruiting'] },
  potato:     { base: 2800, critical: ['vegetative', 'fruiting'] },
  onion:      { base: 2200, critical: ['vegetative', 'fruiting'] },
  maize:      { base: 2600, critical: ['flowering', 'fruiting'] },
  soybean:    { base: 2400, critical: ['flowering', 'fruiting'] },
  groundnut:  { base: 2200, critical: ['flowering', 'fruiting'] },
};

const soilRetention = {
  sandy:  0.7,   // drains fast — needs more frequent irrigation
  loamy:  1.0,   // balanced
  clay:   1.3,   // retains well
  silty:  1.15,
  peaty:  1.2,
};

const stageMultiplier = {
  seedling:    0.5,
  vegetative:  0.8,
  flowering:   1.2,
  fruiting:    1.1,
  harvest:     0.4,
};

const methodMap = {
  sandy:     'Drip Irrigation',
  loamy:     'Sprinkler or Furrow Irrigation',
  clay:      'Flood / Basin Irrigation',
  silty:     'Sprinkler Irrigation',
  peaty:     'Drip Irrigation',
};

/**
 * Returns irrigation recommendation object.
 */
export function getIrrigationPlan({ crop, soil, stage, daysSinceLast, recentRain, temperature }) {
  const cropData = cropWaterNeeds[crop] || cropWaterNeeds.wheat;
  const retention = soilRetention[soil] || 1.0;
  const stageMult = stageMultiplier[stage] || 1.0;
  const isCritical = cropData.critical.includes(stage);

  // Effective rainfall (sandy soil absorbs only 60%, clay absorbs 90%)
  const rainAbsorption = soil === 'sandy' ? 0.6 : soil === 'clay' ? 0.9 : 0.75;
  const effectiveRain = recentRain * rainAbsorption;

  // Base water need per acre for this stage
  let waterNeeded = (cropData.base * stageMult) / 7; // per day need
  // Adjust for temperature — hot weather increases need
  const tempFactor = temperature > 35 ? 1.2 : temperature > 30 ? 1.1 : temperature < 20 ? 0.85 : 1.0;
  waterNeeded *= tempFactor;
  // Soil retention affects frequency
  waterNeeded /= retention;
  // Subtract effective rainfall
  const deficit = Math.max(0, (waterNeeded * daysSinceLast) - effectiveRain);

  // Irrigation interval in days
  let intervalDays = Math.round(6 * retention / tempFactor);
  if (soil === 'sandy') intervalDays = Math.max(2, intervalDays - 1);
  if (isCritical) intervalDays = Math.max(1, intervalDays - 1);

  // Per irrigation session — total deficit rounded up
  const perSessionLiters = Math.round(deficit);

  // Next irrigation date
  const today = new Date();
  const nextDate = new Date(today);
  // If deficit is very small, water in intervalDays; else water sooner
  const urgency = deficit > waterNeeded * 0.5 ? 1 : intervalDays;
  nextDate.setDate(today.getDate() + urgency);

  const advice = buildAdvice({ crop, soil, stage, isCritical, temperature, recentRain, deficit });

  return {
    waterAmount: perSessionLiters > 0 ? perSessionLiters : Math.round(waterNeeded * intervalDays),
    frequency: intervalDays,
    method: methodMap[soil] || 'Sprinkler Irrigation',
    nextDate: nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    advice,
    urgency: deficit > waterNeeded * 1.5 ? 'high' : deficit > waterNeeded * 0.5 ? 'medium' : 'low',
  };
}

function buildAdvice({ crop, soil, stage, isCritical, temperature, recentRain, deficit }) {
  const tips = [];

  if (isCritical) {
    tips.push(`⚠️ ${capitalise(crop)} is in a water-critical stage (${stage}). Ensure consistent moisture to protect yield.`);
  }
  if (temperature > 35) {
    tips.push('🌡️ High temperature detected. Irrigate early morning (before 8 AM) or evening (after 6 PM) to reduce evaporation losses.');
  }
  if (soil === 'sandy') {
    tips.push('🏜️ Sandy soil drains quickly. Consider more frequent, lighter irrigations rather than heavy single watering sessions.');
  }
  if (recentRain > 30) {
    tips.push(`🌧️ Significant recent rainfall (${recentRain} mm). Skip next scheduled irrigation if soil is still moist.`);
  }
  if (deficit === 0) {
    tips.push('✅ Soil moisture is currently adequate. Monitor weather and check soil before next irrigation.');
  }
  tips.push(`💧 Use ${methodMap[soil] || 'Sprinkler Irrigation'} for best water efficiency with ${soil} soil.`);
  if (stage === 'harvest') {
    tips.push('🌾 Approaching harvest. Reduce irrigation to allow soil to dry slightly for easier harvesting.');
  }

  return tips;
}

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
