// East African Tax Configurations
export interface TaxRate {
  minAmount?: number;
  maxAmount?: number;
  rate: number;
  description?: string;
}

export interface WithholdingTaxRate {
  category: string;
  rate: number;
  description: string;
}

export interface SocialSecurityRate {
  minSalary?: number;
  maxSalary?: number;
  employeeRate?: number;
  employerRate?: number;
  totalRate?: number;
  contribution?: number;
}

export interface HealthInsuranceRate {
  minSalary?: number;
  maxSalary?: number;
  contribution: number;
}

export interface CountryTaxConfig {
  countryCode: string;
  countryName: string;
  currency: string;
  currencySymbol: string;
  taxAuthority: string;
  vatRate: number;
  vatExemptItems: string[];
  corporateTaxRate: number;
  payeRates: TaxRate[];
  withholdingTaxRates: WithholdingTaxRate[];
  socialSecurity?: {
    name: string;
    rates: SocialSecurityRate[];
  };
  healthInsurance?: {
    name: string;
    rates: HealthInsuranceRate[];
  };
  turnoverTax?: {
    threshold: number;
    rate: number;
  };
  counties?: string[];
  regions?: string[];
}

// East African Countries Tax Configurations
export const eastAfricanTaxConfigs: Record<string, CountryTaxConfig> = {
  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    currency: 'KES',
    currencySymbol: 'KES',
    taxAuthority: 'Kenya Revenue Authority (KRA)',
    vatRate: 16,
    vatExemptItems: ['Basic Food Items', 'Medical Supplies', 'Educational Materials', 'Agricultural Inputs'],
    corporateTaxRate: 30,
    payeRates: [
      { minAmount: 0, maxAmount: 24000, rate: 10 },
      { minAmount: 24001, maxAmount: 32333, rate: 25 },
      { minAmount: 32334, maxAmount: 500000, rate: 30 },
      { minAmount: 500001, maxAmount: 800000, rate: 32.5 },
      { minAmount: 800001, maxAmount: Infinity, rate: 35 }
    ],
    withholdingTaxRates: [
      { category: 'PROFESSIONAL_SERVICES', rate: 5, description: 'Professional services' },
      { category: 'RENT', rate: 10, description: 'Rent payments' },
      { category: 'INTEREST', rate: 15, description: 'Interest payments' },
      { category: 'DIVIDENDS', rate: 5, description: 'Dividend payments' },
      { category: 'MANAGEMENT_FEES', rate: 5, description: 'Management and consultancy fees' },
      { category: 'TECHNICAL_FEES', rate: 5, description: 'Technical fees' },
      { category: 'COMMISSION', rate: 5, description: 'Commission payments' },
      { category: 'ROYALTIES', rate: 5, description: 'Royalty payments' }
    ],
    socialSecurity: {
      name: 'National Social Security Fund (NSSF)',
      rates: [
        { minSalary: 0, maxSalary: 18000, employeeRate: 6, employerRate: 6, totalRate: 12 }
      ]
    },
    healthInsurance: {
      name: 'National Hospital Insurance Fund (NHIF)',
      rates: [
        { minSalary: 0, maxSalary: 5999, contribution: 150 },
        { minSalary: 6000, maxSalary: 7999, contribution: 300 },
        { minSalary: 8000, maxSalary: 11999, contribution: 400 },
        { minSalary: 12000, maxSalary: 14999, contribution: 500 },
        { minSalary: 15000, maxSalary: 19999, contribution: 600 },
        { minSalary: 20000, maxSalary: 24999, contribution: 750 },
        { minSalary: 25000, maxSalary: 29999, contribution: 850 },
        { minSalary: 30000, maxSalary: 34999, contribution: 900 },
        { minSalary: 35000, maxSalary: 39999, contribution: 950 },
        { minSalary: 40000, maxSalary: 44999, contribution: 1000 },
        { minSalary: 45000, maxSalary: 49999, contribution: 1100 },
        { minSalary: 50000, maxSalary: 59999, contribution: 1200 },
        { minSalary: 60000, maxSalary: 69999, contribution: 1300 },
        { minSalary: 70000, maxSalary: 79999, contribution: 1400 },
        { minSalary: 80000, maxSalary: 89999, contribution: 1500 },
        { minSalary: 90000, maxSalary: 99999, contribution: 1600 },
        { minSalary: 100000, maxSalary: Infinity, contribution: 1700 }
      ]
    },
    turnoverTax: {
      threshold: 5000000, // KES 5M
      rate: 3
    },
    counties: [
      'Nairobi', 'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita Taveta', 'Garissa', 'Wajir', 'Mandera',
      'Marsabit', 'Isiolo', 'Meru', 'Tharaka Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri',
      'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet',
      'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
      'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
    ]
  },

  TZ: {
    countryCode: 'TZ',
    countryName: 'Tanzania',
    currency: 'TZS',
    currencySymbol: 'TZS',
    taxAuthority: 'Tanzania Revenue Authority (TRA)',
    vatRate: 18,
    vatExemptItems: ['Basic Food Items', 'Medical Supplies', 'Books', 'Agricultural Inputs'],
    corporateTaxRate: 30,
    payeRates: [
      { minAmount: 0, maxAmount: 270000, rate: 0 },
      { minAmount: 270001, maxAmount: 520000, rate: 8 },
      { minAmount: 520001, maxAmount: 760000, rate: 20 },
      { minAmount: 760001, maxAmount: 1000000, rate: 25 },
      { minAmount: 1000001, maxAmount: Infinity, rate: 30 }
    ],
    withholdingTaxRates: [
      { category: 'PROFESSIONAL_SERVICES', rate: 5, description: 'Professional services' },
      { category: 'RENT', rate: 10, description: 'Rent payments' },
      { category: 'INTEREST', rate: 10, description: 'Interest payments' },
      { category: 'DIVIDENDS', rate: 10, description: 'Dividend payments' },
      { category: 'MANAGEMENT_FEES', rate: 5, description: 'Management fees' },
      { category: 'TECHNICAL_FEES', rate: 5, description: 'Technical services' }
    ],
    socialSecurity: {
      name: 'National Social Security Fund (NSSF)',
      rates: [
        { minSalary: 0, maxSalary: 4000, employeeRate: 10, employerRate: 10, totalRate: 20 },
        { minSalary: 4001, maxSalary: Infinity, employeeRate: 10, employerRate: 10, totalRate: 20 }
      ]
    },
    regions: [
      'Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Morogoro', 'Tanga', 'Mbeya', 'Tabora', 'Shinyanga', 'Kagera',
      'Kigoma', 'Rukwa', 'Iringa', 'Singida', 'Mtwara', 'Lindi', 'Manyara', 'Njombe', 'Katavi', 'Simiyu',
      'Geita', 'Songwe', 'Pwani', 'Kilimanjaro', 'Mara', 'Zanzibar North', 'Zanzibar South', 'Zanzibar West'
    ]
  },

  UG: {
    countryCode: 'UG',
    countryName: 'Uganda',
    currency: 'UGX',
    currencySymbol: 'UGX',
    taxAuthority: 'Uganda Revenue Authority (URA)',
    vatRate: 18,
    vatExemptItems: ['Basic Food Items', 'Medical Supplies', 'Books', 'Agricultural Inputs', 'Water'],
    corporateTaxRate: 30,
    payeRates: [
      { minAmount: 0, maxAmount: 235000, rate: 0 },
      { minAmount: 235001, maxAmount: 335000, rate: 10 },
      { minAmount: 335001, maxAmount: 410000, rate: 20 },
      { minAmount: 410001, maxAmount: Infinity, rate: 30 }
    ],
    withholdingTaxRates: [
      { category: 'PROFESSIONAL_SERVICES', rate: 6, description: 'Professional services' },
      { category: 'RENT', rate: 10, description: 'Rent payments' },
      { category: 'INTEREST', rate: 15, description: 'Interest payments' },
      { category: 'DIVIDENDS', rate: 10, description: 'Dividend payments' },
      { category: 'MANAGEMENT_FEES', rate: 5, description: 'Management fees' },
      { category: 'ROYALTIES', rate: 15, description: 'Royalty payments' }
    ],
    socialSecurity: {
      name: 'National Social Security Fund (NSSF)',
      rates: [
        { minSalary: 0, maxSalary: 400000, employeeRate: 5, employerRate: 10, totalRate: 15 }
      ]
    },
    regions: [
      'Central', 'Eastern', 'Northern', 'Western', 'Kampala'
    ]
  },

  RW: {
    countryCode: 'RW',
    countryName: 'Rwanda',
    currency: 'RWF',
    currencySymbol: 'RWF',
    taxAuthority: 'Rwanda Revenue Authority (RRA)',
    vatRate: 18,
    vatExemptItems: ['Basic Food Items', 'Medical Supplies', 'Books', 'Agricultural Inputs'],
    corporateTaxRate: 30,
    payeRates: [
      { minAmount: 0, maxAmount: 30000, rate: 0 },
      { minAmount: 30001, maxAmount: 100000, rate: 20 },
      { minAmount: 100001, maxAmount: Infinity, rate: 30 }
    ],
    withholdingTaxRates: [
      { category: 'PROFESSIONAL_SERVICES', rate: 5.1, description: 'Professional services' },
      { category: 'RENT', rate: 15, description: 'Rent payments' },
      { category: 'INTEREST', rate: 15, description: 'Interest payments' },
      { category: 'DIVIDENDS', rate: 15, description: 'Dividend payments' },
      { category: 'ROYALTIES', rate: 15, description: 'Royalty payments' }
    ],
    socialSecurity: {
      name: 'Rwanda Social Security Board (RSSB)',
      rates: [
        { minSalary: 0, maxSalary: 50000, employeeRate: 3, employerRate: 3, totalRate: 6 },
        { minSalary: 50001, maxSalary: Infinity, employeeRate: 5, employerRate: 5, totalRate: 10 }
      ]
    },
    regions: [
      'Kigali', 'Northern', 'Southern', 'Eastern', 'Western'
    ]
  },

  ET: {
    countryCode: 'ET',
    countryName: 'Ethiopia',
    currency: 'ETB',
    currencySymbol: 'ETB',
    taxAuthority: 'Ethiopian Revenue and Customs Authority (ERCA)',
    vatRate: 15,
    vatExemptItems: ['Basic Food Items', 'Medical Supplies', 'Books', 'Agricultural Inputs'],
    corporateTaxRate: 30,
    payeRates: [
      { minAmount: 0, maxAmount: 600, rate: 0 },
      { minAmount: 601, maxAmount: 1650, rate: 10 },
      { minAmount: 1651, maxAmount: 3200, rate: 15 },
      { minAmount: 3201, maxAmount: 5250, rate: 20 },
      { minAmount: 5251, maxAmount: 7800, rate: 25 },
      { minAmount: 7801, maxAmount: 10900, rate: 30 },
      { minAmount: 10901, maxAmount: Infinity, rate: 35 }
    ],
    withholdingTaxRates: [
      { category: 'PROFESSIONAL_SERVICES', rate: 2, description: 'Professional services' },
      { category: 'RENT', rate: 5, description: 'Rent payments' },
      { category: 'INTEREST', rate: 5, description: 'Interest payments' },
      { category: 'DIVIDENDS', rate: 10, description: 'Dividend payments' },
      { category: 'ROYALTIES', rate: 5, description: 'Royalty payments' }
    ],
    regions: [
      'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa', 'Gambela', 'Harari', 'Oromia', 'Somali', 'Tigray', 'Sidama', 'South West Ethiopia'
    ]
  },

  BI: {
    countryCode: 'BI',
    countryName: 'Burundi',
    currency: 'BIF',
    currencySymbol: 'BIF',
    taxAuthority: 'Office Burundais des Recettes (OBR)',
    vatRate: 18,
    vatExemptItems: ['Basic Food Items', 'Medical Supplies', 'Books', 'Agricultural Inputs'],
    corporateTaxRate: 30,
    payeRates: [
      { minAmount: 0, maxAmount: 50000, rate: 0 },
      { minAmount: 50001, maxAmount: 150000, rate: 15 },
      { minAmount: 150001, maxAmount: 300000, rate: 20 },
      { minAmount: 300001, maxAmount: Infinity, rate: 30 }
    ],
    withholdingTaxRates: [
      { category: 'PROFESSIONAL_SERVICES', rate: 5, description: 'Professional services' },
      { category: 'RENT', rate: 10, description: 'Rent payments' },
      { category: 'INTEREST', rate: 15, description: 'Interest payments' },
      { category: 'DIVIDENDS', rate: 10, description: 'Dividend payments' }
    ],
    regions: [
      'Bujumbura Mairie', 'Bujumbura Rural', 'Cibitoke', 'Gitega', 'Rutana', 'Ruyigi', 'Karuzi', 'Kayanza', 'Kirundo', 'Muyinga', 'Ngozi', 'Muramvya', 'Mwaro', 'Bururi', 'Makamba', 'Rumonge', 'Cankuzo', 'Rumonge', 'Makamba'
    ]
  }
};

export const getCountryTaxConfig = (countryCode: string): CountryTaxConfig | null => {
  return eastAfricanTaxConfigs[countryCode] || null;
};

export const getAllEastAfricanCountries = (): CountryTaxConfig[] => {
  return Object.values(eastAfricanTaxConfigs);
};