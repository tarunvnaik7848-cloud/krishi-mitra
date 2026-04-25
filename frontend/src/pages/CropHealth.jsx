import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDiagnosis, CROPS, SYMPTOMS } from '../data/cropHealthEngine';

const severityConfig = {
  low:    { badge: 'badge-green', label: 'Low',    icon: '🟢', bar: 'w-1/3  bg-green-400' },
  medium: { badge: 'badge-yellow', label: 'Medium', icon: '🟡', bar: 'w-2/3  bg-yellow-400' },
  high:   { badge: 'badge-red',   label: 'High',   icon: '🔴', bar: 'w-full bg-red-400' },
};

export default function CropHealth() {
  const { t } = useTranslation();

  const [crop, setCrop]       = useState('');
  const [symptom, setSymptom] = useState('');
  const [extra, setExtra]     = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = (e) => {
    e.preventDefault();
    if (!crop || !symptom) return;
    setLoading(true);
    setTimeout(() => {
      setResult(getDiagnosis(crop, symptom));
      setLoading(false);
    }, 900);
  };

  const sev = result ? severityConfig[result.severity] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="section-title">{t('crop_health.title')}</h1>
      <p className="section-subtitle">{t('crop_health.subtitle')}</p>

      {/* Form */}
      <form onSubmit={handleDiagnose} className="card mb-8 space-y-4">
        {/* Crop select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('crop_health.select_crop')} *
          </label>
          <div className="relative">
            <select
              className="select-field pr-10"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              required
            >
              <option value="">— {t('crop_health.select_crop')} —</option>
              {CROPS.map((c) => (
                <option key={c.value} value={c.value}>
                  {t(`crop_health.crops.${c.value}`, { defaultValue: c.label })}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
          </div>
        </div>

        {/* Symptom select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('crop_health.select_symptom')} *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SYMPTOMS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSymptom(s.value)}
                className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                  symptom === s.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-primary-300 text-gray-600'
                }`}
              >
                {t(`crop_health.symptom_${s.value}`, { defaultValue: s.label })}
              </button>
            ))}
          </div>
        </div>

        {/* Extra info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('crop_health.additional_info')}
          </label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="E.g. affecting 30% of plants, started 5 days ago, after heavy rain..."
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full text-center text-base py-3"
          disabled={!crop || !symptom || loading}
        >
          {loading ? '🔍 Analysing...' : `🔍 ${t('crop_health.analyze')}`}
        </button>
      </form>

      {/* Result */}
      {loading && (
        <div className="card text-center py-12">
          <div className="text-5xl mb-3 animate-pulse">🌿</div>
          <p className="text-gray-500">{t('loading')}</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-5">
          {/* Diagnosis card */}
          <div className="card border-l-4 border-primary-400">
            <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{result.disease}</h2>
                <p className="text-sm text-gray-500 mt-1">{result.cause}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={sev.badge}>{sev.icon} {t(`crop_health.severity_${result.severity}`)}</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className={`h-full rounded-full ${sev.bar}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Treatment */}
          <div className="card">
            <h3 className="font-bold text-primary-700 mb-3 flex items-center gap-2">
              <span>💊</span> {t('crop_health.treatment')}
            </h3>
            <ul className="space-y-2">
              {result.treatment.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-primary-500 font-bold flex-shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention */}
          <div className="card bg-green-50 border-green-200">
            <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
              <span>🛡️</span> {t('crop_health.prevention')}
            </h3>
            <ul className="space-y-2">
              {result.prevention.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-gray-400 text-center">
            ⚠️ This AI diagnosis is advisory. For severe cases, consult your local Krishi Vigyan Kendra (KVK) or agricultural officer.
          </p>
        </div>
      )}
    </div>
  );
}
