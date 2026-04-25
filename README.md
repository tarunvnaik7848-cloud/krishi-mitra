# 🌾 Krishi Mitra — AI-Powered Farming Assistant

**Empowering rural farmers with AI-driven decisions on irrigation, crop health, weather, and market prices — simple, affordable, and multilingual.**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20हिंदी%20%7C%20मराठी-green)](https://react.i18next.com)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌤️ **Weather Forecast** | 7-day forecast with AI-generated farming tips based on temperature, humidity, rainfall |
| 🌿 **Crop Health Advisor** | Symptom-based AI diagnosis for 10+ crops — disease identification, treatment & prevention |
| 💧 **Smart Irrigation Planner** | AI recommendation engine based on crop type, soil, growth stage, recent rainfall & temperature |
| 📊 **Market Prices** | Live-style crop prices from major Indian mandis with trend charts |
| 🗣️ **Multilingual** | Full support for English, हिंदी (Hindi) and मराठी (Marathi) |
| 📱 **Mobile-first** | Responsive design that works on any device |

---

## 📸 Screenshots

| Home | Crop Health |
|---|---|
| Hero with AI-Powered • Multilingual • Free badge | Symptom-selector grid + AI diagnosis |

| Irrigation Planner | Market Prices |
|---|---|
| Visual soil/stage selectors + sliders | Price table with mini trend charts |

---

## 🚀 Getting Started

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` in your browser.

---

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Sticky nav with language switcher
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with feature cards
│   │   ├── Weather.jsx         # 7-day forecast + AI farming tips
│   │   ├── CropHealth.jsx      # Disease diagnosis form + results
│   │   ├── Irrigation.jsx      # Irrigation planner form + plan
│   │   └── Market.jsx          # Market prices table + mini charts
│   ├── data/
│   │   ├── weatherEngine.js    # Mock weather generator + AI tip engine
│   │   ├── cropHealthEngine.js # Rule-based crop disease diagnosis DB
│   │   ├── irrigationEngine.js # Irrigation recommendation calculator
│   │   └── marketData.js       # Mock mandi price data for 10 crops
│   ├── locales/
│   │   ├── en.json             # English translations
│   │   ├── hi.json             # Hindi translations (हिंदी)
│   │   └── mr.json             # Marathi translations (मराठी)
│   ├── i18n.js                 # i18next setup
│   ├── App.jsx                 # Root component with router
│   └── main.jsx                # Entry point
└── package.json
```

---

## 🌐 Multilingual Support

Switch languages instantly using the **EN / हि / म** pills in the navbar. The chosen language is saved in `localStorage` and persists across visits. All UI text, crop names, soil types, and crop stage labels are fully translated.

---

## 🤖 AI Engines

All AI reasoning runs client-side (no API key required):

- **Irrigation Engine** — calculates water deficit from crop water needs × stage multiplier × soil retention, adjusted for temperature and recent rainfall
- **Crop Health Engine** — maps `(crop, symptom)` pairs to a curated diagnosis database with treatment protocols and prevention tips
- **Weather Engine** — generates realistic 7-day forecasts and derives actionable farming tips from rainfall totals, temperature extremes, UV index and humidity

> In production, the weather and market modules can be wired to real APIs (OpenWeatherMap, Agmarknet) with minimal changes.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS 3 (custom green + earth palette)
- **Routing**: React Router v6
- **i18n**: react-i18next + i18next-browser-languagedetector
- **Build**: Vite (< 700 ms production build)

---

*Made with ❤️ for India's farmers*

