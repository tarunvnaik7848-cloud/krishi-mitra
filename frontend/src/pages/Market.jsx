import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { marketPrices, statesList } from '../data/marketData';

const trendConfig = {
  up:     { icon: '↑', color: 'text-green-600',  badge: 'badge-green'  },
  down:   { icon: '↓', color: 'text-red-600',    badge: 'badge-red'    },
  stable: { icon: '→', color: 'text-gray-500',   badge: 'badge-yellow' },
};

function MiniChart({ data, trend }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = 40, pad = 4;
  const points = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (w - 2 * pad),
    h - pad - ((v - min) / range) * (h - 2 * pad),
  ]);
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const stroke = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#94a3b8';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-24 h-8">
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={stroke} />
      ))}
    </svg>
  );
}

export default function Market() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('All States');
  const [selectedCrop, setSelectedCrop] = useState(null);

  const getCropName = (item) => {
    if (i18n.language === 'hi') return item.cropHi;
    if (i18n.language === 'mr') return item.cropMr;
    return item.crop;
  };

  const filtered = useMemo(() => {
    const getLocalName = (item) => {
      if (i18n.language === 'hi') return item.cropHi;
      if (i18n.language === 'mr') return item.cropMr;
      return item.crop;
    };
    return marketPrices.filter((item) => {
      const name = getLocalName(item).toLowerCase();
      const matchSearch = name.includes(search.toLowerCase()) || item.crop.toLowerCase().includes(search.toLowerCase());
      const matchState  = filterState === 'All States' || item.state === filterState;
      return matchSearch && matchState;
    });
  }, [search, filterState, i18n.language]);

  const selected = selectedCrop ? marketPrices.find((m) => m.id === selectedCrop) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="section-title">{t('market.title')}</h1>
      <p className="section-subtitle">{t('market.subtitle')}</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          className="input-field flex-1"
          placeholder={t('market.search_crop')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="relative sm:w-52">
          <select
            className="select-field pr-10"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            {statesList.map((s) => (
              <option key={s} value={s}>
                {s === 'All States' ? t('market.all_states') : s}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
        </div>
      </div>

      {/* Price chart for selected crop */}
      {selected ? (
        <div className="card mb-6 border-primary-200 bg-primary-50">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <h2 className="font-bold text-primary-800 text-lg">{getCropName(selected)}</h2>
              <p className="text-sm text-gray-500">{selected.mandi}, {selected.state}</p>
            </div>
            <button
              onClick={() => setSelectedCrop(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >✕ Close</button>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">{t('market.price_chart')}</div>
            <div className="flex items-end gap-1 h-24">
              {selected.history.map((price, i) => {
                const max = Math.max(...selected.history);
                const min = Math.min(...selected.history);
                const height = ((price - min) / (max - min + 1)) * 80 + 10;
                const isLast = i === selected.history.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-gray-400">{price >= 1000 ? `${(price/1000).toFixed(1)}k` : price}</div>
                    <div
                      className={`w-full rounded-t-lg transition-all ${isLast ? 'bg-primary-500' : 'bg-primary-200'}`}
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-gray-400">D{i + 1}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="card mb-6 bg-gray-50 border-dashed text-center py-6 text-gray-400 text-sm">
          {t('market.select_crop_chart')}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">{t('market.crop')}</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">{t('market.mandi')}</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">{t('market.state')}</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">{t('market.min_price')}</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">{t('market.modal_price')}</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">{t('market.max_price')}</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">{t('market.trend')}</th>
              <th className="text-center px-3 py-3 font-semibold text-gray-600 hidden lg:table-cell">Chart</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400">No results found</td>
              </tr>
            )}
            {filtered.map((item) => {
              const tc = trendConfig[item.trend];
              return (
                <tr
                  key={item.id}
                  className={`border-b border-gray-50 hover:bg-primary-50 cursor-pointer transition-colors ${selectedCrop === item.id ? 'bg-primary-50' : ''}`}
                  onClick={() => setSelectedCrop(item.id === selectedCrop ? null : item.id)}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{getCropName(item)}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{item.mandi}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.state}</td>
                  <td className="px-4 py-3 text-right text-gray-700">₹{item.min.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary-700">₹{item.modal.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-700">₹{item.max.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold ${tc.color}`}>
                      {tc.icon} {t(`market.trend_${item.trend}`)}
                    </span>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <div className="flex justify-center">
                      <MiniChart data={item.history} trend={item.trend} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
          {t('market.unit')} • {t('market.last_updated')}: 25 Apr 2024
        </div>
      </div>
    </div>
  );
}
