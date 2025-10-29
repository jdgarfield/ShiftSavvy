// State income tax rates (approximate 2024 rates for middle income brackets)
// These are simplified average rates - actual rates vary by income level
export const STATE_TAX_RATES: Record<string, number> = {
  'AL': 0.05,   // Alabama
  'AK': 0.00,   // Alaska (no state income tax)
  'AZ': 0.025,  // Arizona
  'AR': 0.05,   // Arkansas
  'CA': 0.08,   // California
  'CO': 0.0463, // Colorado
  'CT': 0.05,   // Connecticut
  'DE': 0.055,  // Delaware
  'FL': 0.00,   // Florida (no state income tax)
  'GA': 0.0575, // Georgia
  'HI': 0.08,   // Hawaii
  'ID': 0.06,   // Idaho
  'IL': 0.0495, // Illinois
  'IN': 0.0323, // Indiana
  'IA': 0.06,   // Iowa
  'KS': 0.057,  // Kansas
  'KY': 0.05,   // Kentucky
  'LA': 0.0425, // Louisiana
  'ME': 0.075,  // Maine
  'MD': 0.0575, // Maryland
  'MA': 0.05,   // Massachusetts
  'MI': 0.0425, // Michigan
  'MN': 0.0798, // Minnesota
  'MS': 0.05,   // Mississippi
  'MO': 0.054,  // Missouri
  'MT': 0.0675, // Montana
  'NE': 0.0684, // Nebraska
  'NV': 0.00,   // Nevada (no state income tax)
  'NH': 0.00,   // New Hampshire (no wage income tax)
  'NJ': 0.0637, // New Jersey
  'NM': 0.049,  // New Mexico
  'NY': 0.065,  // New York
  'NC': 0.0499, // North Carolina
  'ND': 0.029,  // North Dakota
  'OH': 0.0399, // Ohio
  'OK': 0.05,   // Oklahoma
  'OR': 0.09,   // Oregon
  'PA': 0.0307, // Pennsylvania
  'RI': 0.0599, // Rhode Island
  'SC': 0.07,   // South Carolina
  'SD': 0.00,   // South Dakota (no state income tax)
  'TN': 0.00,   // Tennessee (no wage income tax)
  'TX': 0.00,   // Texas (no state income tax)
  'UT': 0.0495, // Utah
  'VT': 0.066,  // Vermont
  'VA': 0.0575, // Virginia
  'WA': 0.00,   // Washington (no state income tax)
  'WV': 0.065,  // West Virginia
  'WI': 0.0627, // Wisconsin
  'WY': 0.00,   // Wyoming (no state income tax)
};

export const FEDERAL_TAX_RATE = 0.22; // Standard 22% bracket for middle income
