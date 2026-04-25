import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'hi', label: 'हिंदी',   native: 'हि' },
  { code: 'mr', label: 'मराठी',   native: 'म' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/',          key: 'nav.home',        icon: '🏠' },
    { path: '/weather',   key: 'nav.weather',     icon: '🌤️' },
    { path: '/crop-health', key: 'nav.crop_health', icon: '🌿' },
    { path: '/irrigation', key: 'nav.irrigation',  icon: '💧' },
    { path: '/market',    key: 'nav.market',      icon: '📊' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-green-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl">🌾</span>
            <div>
              <div className="font-bold text-primary-700 text-lg leading-tight">{t('app_name')}</div>
              <div className="text-xs text-gray-400 leading-tight hidden sm:block">{t('tagline')}</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{item.icon}</span>
                <span>{t(item.key)}</span>
              </Link>
            ))}
          </div>

          {/* Language Switcher + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Language pills */}
            <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    i18n.language === lang.code
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={lang.label}
                >
                  {lang.native}
                </button>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium no-underline ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{t(item.key)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
