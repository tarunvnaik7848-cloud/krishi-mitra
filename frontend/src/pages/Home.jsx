import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const features = [
  {
    path: '/weather',
    icon: '🌤️',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    iconBg: 'bg-sky-100',
    text: 'text-sky-700',
    titleKey: 'home.feature_weather',
    descKey: 'home.feature_weather_desc',
  },
  {
    path: '/crop-health',
    icon: '🌿',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    iconBg: 'bg-primary-100',
    text: 'text-primary-700',
    titleKey: 'home.feature_crop',
    descKey: 'home.feature_crop_desc',
  },
  {
    path: '/irrigation',
    icon: '💧',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    text: 'text-blue-700',
    titleKey: 'home.feature_irrigation',
    descKey: 'home.feature_irrigation_desc',
  },
  {
    path: '/market',
    icon: '📊',
    bg: 'bg-earth-50',
    border: 'border-earth-200',
    iconBg: 'bg-earth-100',
    text: 'text-earth-700',
    titleKey: 'home.feature_market',
    descKey: 'home.feature_market_desc',
  },
];

const stats = [
  { icon: '👨‍🌾', value: '10M+', label: 'Farmers Served' },
  { icon: '🌾', value: '50+', label: 'Crops Covered' },
  { icon: '🗣️', value: '3',    label: 'Languages' },
  { icon: '🏅', value: 'Free', label: 'Always Free' },
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white px-4 py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-center pointer-events-none select-none">
          🌾🌱🌿🌾🌱
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span>🤖</span> AI-Powered • Multilingual • Free
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            {t('home.hero_title')}
          </h1>
          <p className="text-primary-100 text-lg md:text-xl mb-8 max-w-xl mx-auto">
            {t('home.hero_sub')}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/crop-health" className="btn-primary text-base px-6 py-3">
              {t('home.get_started')} →
            </Link>
            <Link to="/weather" className="btn-outline bg-white/10 border-white text-white hover:bg-white/20 text-base px-6 py-3">
              {t('home.learn_more')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary-800 text-white px-4 py-4">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-2 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-lg mb-0.5">{s.icon}</div>
              <div className="font-bold text-lg leading-tight">{s.value}</div>
              <div className="text-primary-300 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-center section-title text-3xl mb-2">What can Krishi Mitra do?</h2>
        <p className="text-center text-gray-500 mb-10">Tap any feature to get started</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <Link
              key={f.path}
              to={f.path}
              className={`card ${f.bg} ${f.border} hover:shadow-lg transition-all duration-200 no-underline group hover:-translate-y-1`}
            >
              <div className={`${f.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                {f.icon}
              </div>
              <h3 className={`font-bold text-lg ${f.text} mb-1`}>{t(f.titleKey)}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t(f.descKey)}</p>
              <div className={`mt-4 text-sm font-semibold ${f.text} group-hover:underline`}>
                Explore →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-4 py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title text-2xl mb-2">How it works</h2>
          <p className="text-gray-500 mb-10">Simple 3-step process</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '📍', title: 'Enter your details', desc: 'Tell us your location, crop type, and current field conditions' },
              { step: '2', icon: '🤖', title: 'AI analyses your data', desc: 'Our AI engine processes your inputs using agricultural best practices' },
              { step: '3', icon: '✅', title: 'Get actionable advice', desc: 'Receive simple, easy-to-follow recommendations in your language' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-2xl mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">Step {item.step}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
