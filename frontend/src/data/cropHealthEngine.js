/**
 * Rule-based crop health AI engine.
 * Maps crop + symptom combinations to diagnosis, treatment, prevention.
 */

const diagnosisDB = {
  rice: {
    leaves: {
      disease: 'Bacterial Leaf Blight (BLB)',
      cause: 'Xanthomonas oryzae pv. oryzae bacteria, spread by water and infected plant debris.',
      severity: 'high',
      treatment: [
        'Apply Copper Oxychloride (3 g/L) or Streptomycin sulphate spray.',
        'Remove and burn severely infected plants.',
        'Drain excess standing water from fields.',
        'Apply 2% Zinc Sulphate to boost plant immunity.',
      ],
      prevention: [
        'Use certified disease-free seeds.',
        'Maintain proper plant spacing (20×15 cm).',
        'Avoid excess nitrogen fertilizer.',
        'Use BLB-resistant varieties like IR-64, Swarna.',
      ],
    },
    spots: {
      disease: 'Rice Blast (Pyricularia oryzae)',
      cause: 'Fungal infection. Favoured by cool nights, humid weather, and excess nitrogen.',
      severity: 'high',
      treatment: [
        'Spray Tricyclazole (0.6 g/L) or Isoprothiolane at first symptoms.',
        'Apply Mancozeb (2 g/L) as a preventive fungicide.',
        'Avoid overhead irrigation during humid periods.',
      ],
      prevention: [
        'Use blast-resistant varieties.',
        'Apply silicon-based fertilizers (strengthens cell walls).',
        'Balance nitrogen application; avoid excess urea.',
        'Rotate crops to break disease cycle.',
      ],
    },
    wilting: {
      disease: 'Root Rot / Stem Rot (Helminthosporium oryzae)',
      cause: 'Fungal root infection due to waterlogged conditions and poor drainage.',
      severity: 'medium',
      treatment: [
        'Improve field drainage immediately.',
        'Apply Carbendazim (1 g/L) soil drench.',
        'Add lime to raise soil pH if acidic.',
      ],
      prevention: [
        'Ensure proper field levelling and drainage.',
        'Avoid transplanting in waterlogged conditions.',
        'Treat seeds with Thiram or Captan before sowing.',
      ],
    },
    pest: {
      disease: 'Brown Planthopper (BPH) / Stem Borer Infestation',
      cause: 'Insect pests; BPH sucks plant sap causing "hopper burn". Stem borers cause "dead heart".',
      severity: 'high',
      treatment: [
        'Apply Imidacloprid (0.3 ml/L) or Chlorpyrifos spray.',
        'Use yellow sticky traps to monitor and catch adult pests.',
        'Release Trichogramma (biocontrol agent) for stem borers.',
        'Drain water for 3–5 days to reduce BPH habitat.',
      ],
      prevention: [
        'Use resistant varieties like Ratna, Ptb-18.',
        'Maintain a gap of 30 days between consecutive crops.',
        'Avoid excess nitrogen.',
        'Conserve natural enemies (spiders, mirid bugs).',
      ],
    },
    default: {
      disease: 'General Rice Crop Stress',
      cause: 'Multiple possible causes including nutrient deficiency, environmental stress, or early disease.',
      severity: 'low',
      treatment: [
        'Soil test and apply balanced NPK (120:60:60 kg/ha).',
        'Apply zinc sulphate (25 kg/ha) if zinc deficiency suspected.',
        'Ensure adequate irrigation without waterlogging.',
      ],
      prevention: [
        'Use certified quality seeds.',
        'Practice integrated nutrient management.',
        'Monitor crop regularly for early detection.',
      ],
    },
  },

  wheat: {
    spots: {
      disease: 'Wheat Rust (Yellow / Brown / Black Rust)',
      cause: 'Puccinia fungi. Yellow rust favoured by cool (10–15°C) weather; brown rust by warm weather.',
      severity: 'high',
      treatment: [
        'Spray Propiconazole (1 ml/L) or Tebuconazole at first sign.',
        'Apply Mancozeb (2 g/L) for early-stage control.',
        'Repeat spray after 15 days if infection persists.',
      ],
      prevention: [
        'Use rust-resistant varieties (HD-2967, PBW-343).',
        'Avoid late sowing to escape peak rust season.',
        'Ensure good field drainage.',
        'Monitor crop from tillering stage.',
      ],
    },
    growth: {
      disease: 'Karnal Bunt (Tilletia indica)',
      cause: 'Soil-borne fungus infecting wheat grains. Spreads through infected seed and soil.',
      severity: 'medium',
      treatment: [
        'Treat seeds with Carboxin 37.5% + Thiram 37.5% WP (3 g/kg seed).',
        'Spray Propiconazole at late boot stage.',
      ],
      prevention: [
        'Use disease-free certified seeds.',
        'Avoid fields with previous bunt history.',
        'Deep plough to bury infected debris.',
      ],
    },
    default: {
      disease: 'Wheat Nutrient Deficiency or Stress',
      cause: 'Nitrogen, zinc, or iron deficiency; temperature stress or waterlogging.',
      severity: 'low',
      treatment: [
        'Apply top dressing of Urea (50 kg/ha) at crown root initiation.',
        'Spray 0.5% Zinc Sulphate solution.',
        'Ensure timely irrigation at crown root initiation, jointing, flowering.',
      ],
      prevention: [
        'Soil test before sowing; apply balanced fertilizers.',
        'Use improved varieties suited to your agro-climatic zone.',
      ],
    },
  },

  tomato: {
    spots: {
      disease: 'Early Blight (Alternaria solani)',
      cause: 'Fungal disease; circular dark spots with concentric rings on older leaves.',
      severity: 'medium',
      treatment: [
        'Spray Mancozeb (2 g/L) or Chlorothalonil (2 g/L).',
        'Remove and destroy infected leaves.',
        'Apply Azoxystrobin + Difenoconazole for severe infections.',
      ],
      prevention: [
        'Use disease-resistant varieties.',
        'Avoid overhead irrigation; use drip instead.',
        'Remove crop debris after harvest.',
        'Rotate crops every 2 years.',
      ],
    },
    wilting: {
      disease: 'Tomato Wilt (Fusarium / Bacterial Wilt)',
      cause: 'Soil-borne pathogen. Fusarium oxysporum (fungal) or Ralstonia solanacearum (bacterial).',
      severity: 'high',
      treatment: [
        'Remove and destroy wilted plants immediately.',
        'Drench soil with Carbendazim (1 g/L).',
        'For bacterial wilt, apply copper-based bactericide.',
        'Solarize soil in summer to reduce pathogen load.',
      ],
      prevention: [
        'Use resistant rootstocks or grafted plants.',
        'Avoid waterlogging; improve drainage.',
        'Practice 3-year crop rotation.',
        'Sanitize tools between plants.',
      ],
    },
    pest: {
      disease: 'Tomato Fruit Borer (Helicoverpa armigera)',
      cause: 'Larvae bore into fruits, causing up to 60–70% yield loss in severe infestations.',
      severity: 'high',
      treatment: [
        'Spray Spinosad (0.45 ml/L) or Emamectin benzoate (0.5 g/L).',
        'Use pheromone traps (1/acre) to catch male moths.',
        'Apply NPV (Nuclear Polyhedrosis Virus) biological control.',
      ],
      prevention: [
        'Install pheromone traps early in the season.',
        'Intercrop with maize to disrupt pest habitat.',
        'Release Trichogramma cards (1.5 lakh/ha) at egg stage.',
        'Avoid broad-spectrum pesticides to preserve natural enemies.',
      ],
    },
    default: {
      disease: 'Tomato Nutrient Deficiency or Environmental Stress',
      cause: 'Calcium deficiency (blossom end rot), irregular watering, temperature extremes.',
      severity: 'low',
      treatment: [
        'Spray 0.5% Calcium Nitrate solution on leaves.',
        'Ensure consistent soil moisture with mulching.',
        'Apply balanced 19:19:19 NPK fertilizer via fertigation.',
      ],
      prevention: [
        'Maintain even soil moisture; avoid wet-dry cycles.',
        'Use mulching to retain soil moisture.',
        'Test and correct soil calcium levels.',
      ],
    },
  },

  cotton: {
    leaves: {
      disease: 'Cotton Leaf Curl Virus (CLCuV)',
      cause: 'Viral disease spread by whitefly (Bemisia tabaci). Causes leaf curling and stunting.',
      severity: 'high',
      treatment: [
        'There is no cure for CLCuV once infected. Remove affected plants.',
        'Control whitefly vectors with Imidacloprid (0.5 ml/L) or Thiamethoxam.',
        'Apply yellow sticky traps to monitor whitefly population.',
        'Spray Neem-based pesticide (5 ml/L) as a repellent.',
      ],
      prevention: [
        'Use CLCuV-resistant varieties (MNH-786, IUB-13).',
        'Avoid late planting.',
        'Remove weed hosts of whitefly around field borders.',
        'Monitor regularly from early season.',
      ],
    },
    pest: {
      disease: 'Pink Bollworm (Pectinophora gossypiella)',
      cause: 'Larvae damage cotton bolls internally. A major pest of cotton worldwide.',
      severity: 'high',
      treatment: [
        'Use pheromone traps (5/acre) to monitor and mass-trap adult moths.',
        'Spray Profenofos (2 ml/L) or Spinosad at larval stage.',
        'Apply Bacillus thuringiensis (Bt) spray for biological control.',
      ],
      prevention: [
        'Grow Bt cotton (if available) with mandatory refugia.',
        'Destroy crop residue after harvest by deep ploughing.',
        'Avoid off-season cotton to break pest cycle.',
        'Release Trichogramma parasitoids at egg stage.',
      ],
    },
    default: {
      disease: 'Cotton Nutrient Deficiency',
      cause: 'Nitrogen, potassium, or micronutrient deficiency causing leaf symptoms.',
      severity: 'medium',
      treatment: [
        'Apply foliar spray of 2% urea + 1% MgSO4.',
        'Apply 60 kg K2O/ha if potassium deficiency.',
        'Add Boron (1 g/L) for fruit development.',
      ],
      prevention: [
        'Soil test and follow recommended fertilizer schedule.',
        'Apply FYM (20 tonnes/ha) before sowing.',
      ],
    },
  },

  potato: {
    spots: {
      disease: 'Late Blight (Phytophthora infestans)',
      cause: 'Oomycete pathogen; favoured by cool (10–15°C), moist conditions. Highly destructive.',
      severity: 'high',
      treatment: [
        'Spray Metalaxyl + Mancozeb (3 g/L) immediately.',
        'Apply Cymoxanil (0.8 g/L) for active infections.',
        'Remove and destroy infected haulms.',
        'Avoid field operations when foliage is wet.',
      ],
      prevention: [
        'Use certified disease-free seed tubers.',
        'Apply preventive copper fungicide sprays.',
        'Plant resistant varieties (Kufri Sindhuri, Kufri Bahar).',
        'Harvest promptly to prevent tuber infection.',
      ],
    },
    rot: {
      disease: 'Bacterial Soft Rot / Black Leg',
      cause: 'Pectobacterium carotovorum; thrives in warm, wet soil conditions.',
      severity: 'high',
      treatment: [
        'No effective chemical cure once established.',
        'Remove infected plants and improve drainage.',
        'Drench with copper-based bactericide.',
      ],
      prevention: [
        'Plant in well-drained soil; avoid waterlogging.',
        'Use healthy, disease-free seed tubers.',
        'Allow seed cuts to suberize before planting.',
      ],
    },
    default: {
      disease: 'Potato Stress / Nutrient Imbalance',
      cause: 'Irregular irrigation, frost damage, or nutrient deficiency.',
      severity: 'low',
      treatment: [
        'Apply balanced NPK 120:80:120 kg/ha.',
        'Spray 0.5% Borax solution for calcium-boron balance.',
        'Mulch rows to maintain even soil temperature.',
      ],
      prevention: [
        'Plant after last frost date.',
        'Earth up ridges to protect tubers from sunlight.',
      ],
    },
  },

  // Generic fallback for other crops
  default: {
    default: {
      disease: 'General Crop Stress / Unknown Issue',
      cause: 'Possible causes: nutrient deficiency, abiotic stress (heat, drought), fungal or bacterial infection.',
      severity: 'low',
      treatment: [
        'Collect a sample and visit your nearest Krishi Vigyan Kendra (KVK) for laboratory diagnosis.',
        'Ensure balanced fertilization based on recent soil test.',
        'Spray micronutrient mixture (Zinc, Boron, Iron) as a precaution.',
        'Maintain optimal soil moisture.',
      ],
      prevention: [
        'Use certified, disease-resistant varieties.',
        'Practice crop rotation every 2–3 years.',
        'Apply organic matter (FYM) to improve soil health.',
        'Monitor crop weekly for early detection of problems.',
      ],
    },
  },
};

/**
 * Get AI diagnosis based on crop and symptom.
 */
export function getDiagnosis(crop, symptom) {
  const cropData = diagnosisDB[crop] || diagnosisDB.default;
  const result = cropData[symptom] || cropData.default || diagnosisDB.default.default;
  return result;
}

export const CROPS = [
  { value: 'rice',      label: 'Rice (Paddy)' },
  { value: 'wheat',     label: 'Wheat' },
  { value: 'cotton',    label: 'Cotton' },
  { value: 'sugarcane', label: 'Sugarcane' },
  { value: 'tomato',    label: 'Tomato' },
  { value: 'potato',    label: 'Potato' },
  { value: 'onion',     label: 'Onion' },
  { value: 'maize',     label: 'Maize' },
  { value: 'soybean',   label: 'Soybean' },
  { value: 'groundnut', label: 'Groundnut' },
];

export const SYMPTOMS = [
  { value: 'leaves',   label: 'Yellow / Brown Leaves' },
  { value: 'spots',    label: 'Spots on Leaves' },
  { value: 'wilting',  label: 'Wilting / Drooping' },
  { value: 'growth',   label: 'Stunted Growth' },
  { value: 'pest',     label: 'Insects / Pests Visible' },
  { value: 'rot',      label: 'Root / Stem Rot' },
  { value: 'discolor', label: 'Fruit Discoloration' },
];
