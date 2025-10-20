// samplingPlan.js
// Defines the AQL master table for simplified sampling and exposes a helper to
// calculate a sampling plan based on lot size and chosen AQL. See original
// InspectWise Go implementation for reference.

// Define the AQL master table and sampling calculation globally so it is
// available in browsers without module support (e.g. when loaded via file://).
const aqlMasterTable_Simplified = {
  'A': { sampleSize: 2, plans: { '1.0': { ac: 0, re: 1 }, '2.5': { ac: 0, re: 1 }, '4.0': { ac: 0, re: 1 } } },
  'B': { sampleSize: 3, plans: { '1.0': { ac: 0, re: 1 }, '2.5': { ac: 0, re: 1 }, '4.0': { ac: 0, re: 1 } } },
  'C': { sampleSize: 5, plans: { '1.0': { ac: 0, re: 1 }, '2.5': { ac: 0, re: 1 }, '4.0': { ac: 0, re: 1 } } },
  'D': { sampleSize: 8, plans: { '1.0': { ac: 0, re: 1 }, '2.5': { ac: 0, re: 1 }, '4.0': { ac: 1, re: 2 } } },
  'E': { sampleSize: 13, plans: { '1.0': { ac: 0, re: 1 }, '2.5': { ac: 1, re: 2 }, '4.0': { ac: 1, re: 2 } } },
  'F': { sampleSize: 20, plans: { '1.0': { ac: 0, re: 1 }, '2.5': { ac: 1, re: 2 }, '4.0': { ac: 2, re: 3 } } },
  'G': { sampleSize: 32, plans: { '1.0': { ac: 1, re: 2 }, '2.5': { ac: 2, re: 3 }, '4.0': { ac: 3, re: 4 } } },
  'H': { sampleSize: 50, plans: { '1.0': { ac: 1, re: 2 }, '2.5': { ac: 3, re: 4 }, '4.0': { ac: 5, re: 6 } } },
  'J': { sampleSize: 80, plans: { '1.0': { ac: 2, re: 3 }, '2.5': { ac: 5, re: 6 }, '4.0': { ac: 7, re: 8 } } },
  'K': { sampleSize: 125, plans: { '1.0': { ac: 3, re: 4 }, '2.5': { ac: 7, re: 8 }, '4.0': { ac: 10, re: 11 } } },
  'L': { sampleSize: 200, plans: { '1.0': { ac: 5, re: 6 }, '2.5': { ac: 10, re: 11 }, '4.0': { ac: 14, re: 15 } } },
  'M': { sampleSize: 315, plans: { '1.0': { ac: 7, re: 8 }, '2.5': { ac: 14, re: 15 }, '4.0': { ac: 21, re: 22 } } },
  'N': { sampleSize: 500, plans: { '1.0': { ac: 10, re: 11 }, '2.5': { ac: 21, re: 22 }, '4.0': { ac: 21, re: 22 } } },
  'P': { sampleSize: 800, plans: { '1.0': { ac: 14, re: 15 }, '2.5': { ac: 21, re: 22 }, '4.0': { ac: 21, re: 22 } } },
  'Q': { sampleSize: 1250, plans: { '1.0': { ac: 21, re: 22 }, '2.5': { ac: 21, re: 22 }, '4.0': { ac: 21, re: 22 } } }
};

/**
 * Determines the code letter based on the lot size using Level II rules.
 * @param {number} lotSize The total number of pieces in the lot
 * @returns {string} Code letter (A–Q)
 */
function getCodeLetter(lotSize) {
  if (lotSize <= 8) return 'A';
  if (lotSize <= 15) return 'B';
  if (lotSize <= 25) return 'C';
  if (lotSize <= 50) return 'D';
  if (lotSize <= 90) return 'E';
  if (lotSize <= 150) return 'F';
  if (lotSize <= 280) return 'G';
  if (lotSize <= 500) return 'H';
  if (lotSize <= 1200) return 'J';
  if (lotSize <= 3200) return 'K';
  if (lotSize <= 10000) return 'L';
  if (lotSize <= 35000) return 'M';
  if (lotSize <= 150000) return 'N';
  if (lotSize <= 500000) return 'P';
  return 'Q';
}

/**
 * Calculates the sampling plan given a lot size and AQL value.
 * Returns null if the input is invalid or no plan exists for the selected AQL.
 *
 * @param {number} lotSize The lot size entered by the user
 * @param {string} aql The chosen AQL value (e.g. '1.0', '2.5', '4.0')
 * @returns {Object|null} An object containing codeLetter, sampleSize, acceptanceNumber and rejectionNumber
 */
function calculateSamplingPlanInternal(lotSize, aql) {
  const size = Number(lotSize);
  if (!size || size <= 0 || !aql) return null;
  const codeLetter = getCodeLetter(size);
  const plan = aqlMasterTable_Simplified[codeLetter]?.plans[aql];
  if (!plan) return null;
  return {
    codeLetter,
    sampleSize: aqlMasterTable_Simplified[codeLetter].sampleSize,
    acceptanceNumber: plan.ac,
    rejectionNumber: plan.re,
  };
}

// Attach calculateSamplingPlan to the window object
window.calculateSamplingPlan = calculateSamplingPlanInternal;