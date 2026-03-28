/**
 * Standardizes sustainability impact calculations across the Eco-Scan stack.
 * Core Formula: C_saved = weight_kg * impact_factor
 */

export const IMPACT_CONFIG = {
  DEFAULT_WEIGHT_KG: 0.5,
  DEFAULT_IMPACT_FACTOR: 2.5, // kg CO2e per kg
};

export const calculateCO2eSaved = (
  weightKg: number = IMPACT_CONFIG.DEFAULT_WEIGHT_KG, 
  impactFactor: number = IMPACT_CONFIG.DEFAULT_IMPACT_FACTOR
): number => {
  return Number((weightKg * impactFactor).toFixed(2));
};

export const formatImpactLabel = (value: number): string => {
  return `${value.toFixed(1)} kg CO2e`;
};
