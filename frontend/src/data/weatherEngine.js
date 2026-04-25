/**
 * Mock weather data generator + AI farming tip engine.
 * In production, replace fetchWeather() with a real API call (e.g., OpenWeatherMap).
 */

const CONDITIONS = ['Sunny', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Heavy Rain', 'Thunderstorm', 'Foggy'];
const CONDITION_ICONS = {
  'Sunny':         '☀️',
  'Partly Cloudy': '⛅',
  'Overcast':      '☁️',
  'Light Rain':    '🌦️',
  'Heavy Rain':    '🌧️',
  'Thunderstorm':  '⛈️',
  'Foggy':         '🌫️',
};

function randBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function pickCondition(month) {
  // June–September = monsoon bias
  if (month >= 6 && month <= 9) {
    return Math.random() < 0.6 ? (Math.random() < 0.4 ? 'Heavy Rain' : 'Light Rain') : 'Partly Cloudy';
  }
  if (month === 10 || month === 11) return Math.random() < 0.3 ? 'Partly Cloudy' : 'Sunny';
  if (month >= 12 || month <= 2) return Math.random() < 0.4 ? 'Foggy' : 'Sunny';
  return CONDITIONS[Math.floor(Math.random() * (CONDITIONS.length - 2))]; // spring/summer
}

/**
 * Generate 7-day mock weather forecast.
 */
export function generateWeather(location = 'Your Village') {
  const today = new Date();
  const month = today.getMonth() + 1;

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const condition = pickCondition(month);
    const isRaining = condition.includes('Rain') || condition === 'Thunderstorm';

    const temp = randBetween(
      month >= 4 && month <= 6 ? 32 : month >= 11 || month <= 2 ? 12 : 22,
      month >= 4 && month <= 6 ? 44 : month >= 11 || month <= 2 ? 24 : 35
    );

    days.push({
      date: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      condition,
      icon: CONDITION_ICONS[condition] || '🌤️',
      tempMax: temp,
      tempMin: temp - randBetween(5, 10),
      humidity: isRaining ? randBetween(75, 95) : randBetween(40, 70),
      windSpeed: randBetween(5, isRaining ? 35 : 20),
      rainfall: isRaining ? randBetween(5, condition === 'Heavy Rain' ? 80 : 25) : 0,
      uvIndex: isRaining ? randBetween(1, 4) : randBetween(5, 11),
    });
  }

  const todayData = days[0];

  return {
    location,
    today: {
      ...todayData,
      feelsLike: todayData.tempMax - (todayData.humidity > 70 ? -2 : 3),
      sunrise: '06:12 AM',
      sunset: '06:48 PM',
    },
    forecast: days,
    aiTips: generateAITips(days),
  };
}

/**
 * Generate AI farming tips based on the 7-day forecast.
 */
function generateAITips(forecast) {
  const tips = [];
  const today = forecast[0];
  const weeklyRain = forecast.reduce((sum, d) => sum + d.rainfall, 0);
  const avgTemp = forecast.reduce((sum, d) => sum + d.tempMax, 0) / 7;
  const rainyDays = forecast.filter(d => d.rainfall > 0).length;

  if (weeklyRain > 100) {
    tips.push({
      icon: '🌧️',
      tip: 'Heavy rainfall expected this week. Ensure proper drainage in your fields to prevent waterlogging and root diseases.',
      priority: 'high',
    });
    tips.push({
      icon: '🚫',
      tip: 'Avoid pesticide and fertilizer applications on rainy days — they will wash off and waste resources.',
      priority: 'medium',
    });
  } else if (weeklyRain === 0) {
    tips.push({
      icon: '💧',
      tip: 'No rainfall expected. Ensure irrigation is scheduled. Check soil moisture before irrigating to avoid over-watering.',
      priority: 'high',
    });
  } else {
    tips.push({
      icon: '☔',
      tip: `${rainyDays} rainy days expected. Combine rainfall with reduced irrigation to conserve water and reduce costs.`,
      priority: 'medium',
    });
  }

  if (avgTemp > 38) {
    tips.push({
      icon: '🌡️',
      tip: 'Very high temperatures forecasted. Irrigate early morning (5–8 AM) to reduce heat stress. Consider shade nets for vegetables.',
      priority: 'high',
    });
  } else if (avgTemp < 15) {
    tips.push({
      icon: '🥶',
      tip: 'Cold weather ahead. Protect seedlings from frost with mulching or polythene covers. Delay sowing of warm-season crops.',
      priority: 'high',
    });
  }

  if (today.windSpeed > 30) {
    tips.push({
      icon: '💨',
      tip: 'Strong winds today. Avoid spraying operations. Check and reinforce crop support structures.',
      priority: 'medium',
    });
  }

  if (today.humidity > 80 && today.tempMax > 28) {
    tips.push({
      icon: '🍄',
      tip: 'High humidity and warm temperature creates ideal conditions for fungal diseases (blast, blight). Apply preventive fungicide spray.',
      priority: 'high',
    });
  }

  if (today.uvIndex >= 8) {
    tips.push({
      icon: '☀️',
      tip: 'High UV index today. Wear protective clothing while working in the field. Best working hours are 6–10 AM and 4–7 PM.',
      priority: 'low',
    });
  }

  // Always add a general tip
  tips.push({
    icon: '📋',
    tip: 'Record today\'s weather observations in your farm diary for better crop planning next season.',
    priority: 'low',
  });

  return tips;
}
