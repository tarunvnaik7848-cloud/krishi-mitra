import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getIrrigationPlan } from '../data/irrigationEngine';
import { CROPS } from '../data/cropHealthEngine';

const SOILS = [
  { value: 'sandy',  icon: '🏜️' },
  { value: 'loamy',  icon: '🌱' },
  { value: 'clay',   icon: '🏔️' },
  { value: 'silty',  icon: '🌊' },
  { value: 'peaty',  icon: '🌿' },
];

const STAGES = [
  { value: 'seedling',   icon: '🌱' },
  { value: 'vegetative', icon: '🌿' },
  { value: 'flowering',  icon: '🌸' },
  { value: 'fruiting',   icon: '🍅' },
  { value: 'harvest',    icon: '🌾' },
];

const urgencyConfig = {
  high:   { color: 'text-red-600',   bg: 'bg-red-50 border-red-300',   icon: '🚨', label: 'Urgent – irrigate within 24 hours' },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-300', icon: '⚠️', label: 'Irrigate within 2–3 days' },
  low:    { color: 'text-green-600',  bg: 'bg-green-50 border-green-300',  icon: '✅', label: 'Soil moisture is adequate' },
};

export default function Irrigation() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    crop: '',
    soil: '',
    stage: '',
    daysSinceLast: 3,
    recentRain: 0,
    temperature: 30,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.crop || !form.soil || !form.stage) return;
    setLoading(true);
    setTimeout(() => {
      setResult(getIrrigationPlan({
        crop: form.crop,
        soil: form.soil,
        stage: form.stage,
        daysSinceLast: Number(form.daysSinceLast),
        recentRain: Number(form.recentRain),
        temperature: Number(form.temperature),
      }));
      setLoading(false);
    }, 700);
  };

  const urg = result ? urgencyConfig[result.urgency] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="section-title">{t('irrigation.title')}</h1>
      <p className="section-subtitle">{t('irrigation.subtitle')}</p>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-5">
        {/* Crop */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('irrigation.crop_type')} *</label>
          <div className="relative">
            <select className="select-field pr-10" value={form.crop} onChange={(e) => set('crop', e.target.value)} required>
              <option value="">— Select crop —</option>
              {CROPS.map((c) => (
                <option key={c.value} value={c.value}>
                  {t(`crop_health.crops.${c.value}`, { defaultValue: c.label })}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
          </div>
        </div>

        {/* Soil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('irrigation.soil_type')} *</label>
          <div className="grid grid-cols-5 gap-2">
            {SOILS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => set('soil', s.value)}
                className={`py-3 rounded-xl border-2 text-center text-sm font-medium transition-all ${
                  form.soil === s.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 text-gray-600'
                }`}
              >
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-xs leading-tight">{t(`irrigation.soil_${s.value}`)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('irrigation.growth_stage')} *</label>
          <div className="grid grid-cols-5 gap-2">
            {STAGES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => set('stage', s.value)}
                className={`py-3 rounded-xl border-2 text-center text-sm font-medium transition-all ${
                  form.stage === s.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-primary-300 text-gray-600'
                }`}
              >
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-xs leading-tight">{t(`irrigation.stage_${s.value}`).split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('irrigation.last_irrigated')}: <span className="text-primary-600 font-bold">{form.daysSinceLast} {t('irrigation.days')}</span>
            </label>
            <input type="range" min="0" max="20" value={form.daysSinceLast}
              onChange={(e) => set('daysSinceLast', e.target.value)}
              className="w-full accent-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('irrigation.rainfall_recent')}: <span className="text-blue-600 font-bold">{form.recentRain} mm</span>
            </label>
            <input type="range" min="0" max="150" value={form.recentRain}
              onChange={(e) => set('recentRain', e.target.value)}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('irrigation.temperature')}: <span className="text-orange-600 font-bold">{form.temperature}°C</span>
            </label>
            <input type="range" min="10" max="50" value={form.temperature}
              onChange={(e) => set('temperature', e.target.value)}
              className="w-full accent-orange-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full text-center text-base py-3"
          disabled={!form.crop || !form.soil || !form.stage || loading}
        >
          {loading ? '⚙️ Calculating...' : `💧 ${t('irrigation.get_plan')}`}
        </button>
      </form>

      {loading && (
        <div className="card text-center py-12">
          <div className="text-5xl mb-3 animate-spin">⚙️</div>
          <p className="text-gray-500">{t('loading')}</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-5">
          {/* Urgency banner */}
          <div className={`card border-2 ${urg.bg} flex gap-3 items-center`}>
            <span className="text-3xl">{urg.icon}</span>
            <div>
              <div className={`font-bold ${urg.color}`}>{urg.label}</div>
              <div className="text-sm text-gray-500">Based on your field conditions</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '💧', label: t('irrigation.water_amount'), value: `${result.waterAmount.toLocaleString()} L/acre` },
              { icon: '📅', label: t('irrigation.frequency'),    value: `Every ${result.frequency} ${t('irrigation.days')}` },
              { icon: '🚿', label: t('irrigation.method'),       value: result.method },
              { icon: '📆', label: t('irrigation.next_date'),    value: result.nextDate },
            ].map((stat) => (
              <div key={stat.label} className="card text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                <div className="font-semibold text-gray-800 text-sm">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* AI Advice */}
          <div className="card">
            <h3 className="font-bold text-primary-700 mb-3 flex items-center gap-2">
              <span>🤖</span> {t('irrigation.ai_advice')}
            </h3>
            <ul className="space-y-3">
              {result.advice.map((tip, i) => (
                <li key={i} className="flex gap-2 items-start text-sm text-gray-700">
                  <span className="flex-shrink-0 mt-0.5 text-base">{tip.split(' ')[0]}</span>
                  <span>{tip.split(' ').slice(1).join(' ')}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-gray-400 text-center">
            💡 Recommendations are based on general agricultural guidelines. Adjust based on actual soil moisture observation.
          </p>
        </div>
      )}
    </div>
  );
}
