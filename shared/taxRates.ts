/**
 * TAX RATE ESTIMATES FOR 2025
 * 
 * IMPORTANT DISCLAIMER:
 * These are SIMPLIFIED ESTIMATES ONLY for planning purposes.
 * This is a planning tool, not a tax filing tool.
 * 
 * Limitations:
 * - Does NOT account for progressive tax brackets
 * - Does NOT include standard deductions, credits, or exemptions
 * - Rates are approximate middle-income estimates
 * - Actual tax liability varies significantly based on:
 *   - Total income level
 *   - Filing status (single, married, head of household)
 *   - Deductions and credits
 *   - Other income sources
 * 
 * ALWAYS consult with a qualified tax professional or use IRS tools
 * for accurate tax calculations and filing.
 * 
 * Last updated: October 2025
 * Next review recommended: January 2026
 */

// State income tax rates (approximate 2025 rates for middle income brackets)
// NOTE: These are simplified average rates - actual rates vary by income level
export const STATE_TAX_RATES: Record<string, number> = {
  'AL': 0.05,   // Alabama (2-5% progressive)
  'AK': 0.00,   // Alaska (no state income tax)
  'AZ': 0.025,  // Arizona (2.5% flat as of 2024)
  'AR': 0.045,  // Arkansas (0-4.5% progressive, updated 2025)
  'CA': 0.093,  // California (1-13.3% progressive, ~9.3% for middle income)
  'CO': 0.044,  // Colorado (4.4% flat as of 2025)
  'CT': 0.05,   // Connecticut (3-6.99% progressive)
  'DC': 0.085,  // District of Columbia (4-10.75% progressive)
  'DE': 0.055,  // Delaware (0-6.6% progressive)
  'FL': 0.00,   // Florida (no state income tax)
  'GA': 0.0575, // Georgia (1-5.75% progressive)
  'HI': 0.08,   // Hawaii (1.4-11% progressive)
  'ID': 0.058,  // Idaho (5.8% flat as of 2025)
  'IL': 0.0495, // Illinois (4.95% flat)
  'IN': 0.0315, // Indiana (3.15% flat as of 2025)
  'IA': 0.0544, // Iowa (reducing to 3.9% by 2026)
  'KS': 0.057,  // Kansas (3.1-5.7% progressive)
  'KY': 0.04,   // Kentucky (4% flat as of 2025)
  'LA': 0.0425, // Louisiana (1.85-4.25% progressive)
  'ME': 0.075,  // Maine (5.8-7.15% progressive)
  'MD': 0.0575, // Maryland (2-5.75% progressive)
  'MA': 0.05,   // Massachusetts (5% flat, plus 4% on income >$1M)
  'MI': 0.0425, // Michigan (4.25% flat)
  'MN': 0.0798, // Minnesota (5.35-9.85% progressive)
  'MS': 0.05,   // Mississippi (0-5% progressive)
  'MO': 0.0465, // Missouri (0-4.95% progressive, updated 2025)
  'MT': 0.0675, // Montana (4.7-6.75% progressive)
  'NE': 0.0684, // Nebraska (2.46-6.84% progressive)
  'NV': 0.00,   // Nevada (no state income tax)
  'NH': 0.00,   // New Hampshire (no wage income tax, dividends/interest only)
  'NJ': 0.0637, // New Jersey (1.4-10.75% progressive)
  'NM': 0.049,  // New Mexico (1.7-5.9% progressive)
  'NY': 0.065,  // New York (4-10.9% progressive)
  'NC': 0.0475, // North Carolina (4.75% flat as of 2025)
  'ND': 0.029,  // North Dakota (1.1-2.9% progressive)
  'OH': 0.035,  // Ohio (0-3.5% progressive, updated 2025)
  'OK': 0.0475, // Oklahoma (0-4.75% progressive)
  'OR': 0.09,   // Oregon (4.75-9.9% progressive)
  'PA': 0.0307, // Pennsylvania (3.07% flat)
  'RI': 0.0599, // Rhode Island (3.75-5.99% progressive)
  'SC': 0.064,  // South Carolina (0-6.4% progressive)
  'SD': 0.00,   // South Dakota (no state income tax)
  'TN': 0.00,   // Tennessee (no wage income tax)
  'TX': 0.00,   // Texas (no state income tax)
  'UT': 0.0465, // Utah (4.65% flat as of 2025)
  'VT': 0.066,  // Vermont (3.35-8.75% progressive)
  'VA': 0.0575, // Virginia (2-5.75% progressive)
  'WA': 0.00,   // Washington (no state income tax)
  'WV': 0.065,  // West Virginia (2.36-6.5% progressive)
  'WI': 0.0627, // Wisconsin (3.54-7.65% progressive)
  'WY': 0.00,   // Wyoming (no state income tax)
};

/**
 * Federal tax rate estimate
 * 
 * This uses 22% which represents the 22% tax bracket for 2025.
 * The 22% bracket applies to:
 * - Single filers: $47,150 - $100,525
 * - Married filing jointly: $94,300 - $201,050
 * 
 * IMPORTANT: This is a SIMPLIFIED estimate that does NOT account for:
 * - Progressive brackets (10%, 12%, 22%, 24%, 32%, 35%, 37%)
 * - Standard deduction ($14,600 single / $29,200 married for 2024)
 * - Other deductions and credits
 * 
 * For accurate calculations, use IRS tax tables or consult a tax professional.
 */
export const FEDERAL_TAX_RATE = 0.22; // Estimated 22% bracket for middle income

/**
 * Default local tax rate (2%)
 * Users should update this in their profile based on their city/county tax rates
 */
export const DEFAULT_LOCAL_TAX_RATE = 0.02;
