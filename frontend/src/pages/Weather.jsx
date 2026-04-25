import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateWeather } from '../data/weatherEngine';

const priorityColors = {
  high:   'border-red-200 bg-red-50',
  medium: 'border-yellow-200 bg-yellow-50',
  low:    'border-green-200 bg-green-50',
};

const priorityBadge = {
  high:   'badge-red',
  medium: 'badge-yellow',
  low:    'badge-green',
};

export default function Weather() {
  const { t } = useTranslation();
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    setLoading(true);
    // Simulate async API call
    setTimeout(() => {
      setWeather(generateWeather(location.trim()));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="section-title">{t('weather.title')}</h1>
      <p className="section-subtitle">{t('weather.subtitle')}</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          className="input-field flex-1"
          placeholder={t('weather.enter_location')}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
          {loading ? '...' : t('weather.search')}
        </button>
      </form>

      {!weather && !loading && (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">🌤️</div>
          <p className="text-gray-500">{t('weather.enter_location')} to get the forecast</p>
        </div>
      )}

      {loading && (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4 animate-bounce">🌦️</div>
          <p className="text-gray-500">{t('loading')}</p>
        </div>
      )}

      {weather && !loading && (
        <>
          {/* Today Card */}
          <div className="card bg-gradient-to-br from-sky-500 to-blue-600 text-white mb-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-medium opacity-80 mb-1">📍 {weather.location}</div>
                <div className="text-6xl font-bold mb-1">{weather.today.tempMax}°C</div>
                <div className="text-sky-100 text-sm">
                  {t('weather.feel_like')} {weather.today.feelsLike}°C
                </div>
                <div className="text-lg font-medium mt-2">
                  {weather.today.icon} {weather.today.condition}
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="mb-2">💧 {t('weather.humidity')}: {weather.today.humidity}%</div>
                <div className="mb-2">💨 {t('weather.wind')}: {weather.today.windSpeed} km/h</div>
                <div className="mb-2">🌧️ {t('weather.rain')}: {weather.today.rainfall} mm</div>
                <div className="mb-2">☀️ {t('weather.uv_index')}: {weather.today.uvIndex}</div>
                <div className="mb-2">🌅 {t('weather.sunrise')}: {weather.today.sunrise}</div>
                <div>🌇 {t('weather.sunset')}: {weather.today.sunset}</div>
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          <h2 className="font-semibold text-gray-700 mb-3">7-Day Forecast</h2>
          <div className="grid grid-cols-7 gap-2 mb-8">
            {weather.forecast.map((day, i) => (
              <div
                key={i}
                className={`card text-center p-3 ${i === 0 ? 'border-primary-300 bg-primary-50' : ''}`}
              >
                <div className="text-xs font-semibold text-gray-500 mb-1 truncate">{day.date.split(',')[0]}</div>
                <div className="text-2xl mb-1">{day.icon}</div>
                <div className="text-sm font-bold text-gray-800">{day.tempMax}°</div>
                <div className="text-xs text-gray-400">{day.tempMin}°</div>
                {day.rainfall > 0 && (
                  <div className="text-xs text-blue-500 mt-1">💧{day.rainfall}mm</div>
                )}
              </div>
            ))}
          </div>

          {/* AI Tips */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">🤖 {t('weather.ai_tips')}</h2>
            <div className="space-y-3">
              {weather.aiTips.map((tip, i) => (
                <div
                  key={i}
                  className={`card border-l-4 ${priorityColors[tip.priority]} flex gap-3 items-start p-4`}
                >
                  <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <p className="text-gray-700 text-sm leading-relaxed">{tip.tip}</p>
                    <span className={`${priorityBadge[tip.priority]} mt-2`}>
                      {tip.priority === 'high' ? '⚠️ Important' : tip.priority === 'medium' ? 'ℹ️ Note' : '✅ Tip'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
