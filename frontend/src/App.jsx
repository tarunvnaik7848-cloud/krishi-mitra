import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Weather from './pages/Weather';
import CropHealth from './pages/CropHealth';
import Irrigation from './pages/Irrigation';
import Market from './pages/Market';

export default function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-gray-50">
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/weather"      element={<Weather />} />
            <Route path="/crop-health"  element={<CropHealth />} />
            <Route path="/irrigation"   element={<Irrigation />} />
            <Route path="/market"       element={<Market />} />
          </Routes>
        </main>
        <footer className="bg-primary-800 text-primary-200 text-center text-xs py-4 px-4">
          {t('footer')}
        </footer>
      </div>
    </BrowserRouter>
  );
}
