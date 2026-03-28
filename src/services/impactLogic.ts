/**
 * impactLogic.ts – City-adjusted CO2e impact calculations for Eco-Scan.
 *
 * The base carbon saving is:  weight_kg × carbon_impact_factor
 * We then multiply by the city's logisticsMultiplier to reflect higher
 * supply-chain footprints in rural or less-connected areas.
 */

import type { CityInfo } from "../utils/geo";

/** Average weight assumed per scanned item (kg) */
const DEFAULT_WEIGHT_KG = 0.5;

/**
 * Grams of CO2e emitted per passenger-km on a Zupco / omnibus in Zimbabwe.
 * Used to convert CO2e savings into a relatable "km of bus travel" stat.
 */
const ZUPCO_GRAMS_PER_KM = 68; // Harare baseline (overridden per city)

export interface ImpactSummary {
  totalCO2eSavedKg: number;
  adjustedCO2eSavedKg: number;  // factoring in city logistics multiplier
  zupcoKmEquivalent: number;    // km of local bus travel offset
  cityName: string;
  transportLabel: string;
}

/**
 * Calculate the full localized impact summary from a list of pantry items.
 *
 * @param items      — pantry items (each must have carbon_impact_factor and optionally weight_kg)
 * @param city       — resolved CityInfo from getCityFromCoords()
 */
export function calculateLocalImpact(
  items: Array<{ carbon_impact_factor: number; weight_kg?: number }>,
  city: CityInfo
): ImpactSummary {
  const rawKg = items.reduce((acc, item) => {
    const weight = item.weight_kg ?? DEFAULT_WEIGHT_KG;
    return acc + weight * item.carbon_impact_factor;
  }, 0);

  const adjustedKg = rawKg * city.logisticsMultiplier;

  // Convert kg CO2e → grams → km of bus travel
  const gramsPerKm = city.transitGramsPerKm || ZUPCO_GRAMS_PER_KM;
  const zupcoKm = Math.round((adjustedKg * 1000) / gramsPerKm);

  return {
    totalCO2eSavedKg: parseFloat(rawKg.toFixed(2)),
    adjustedCO2eSavedKg: parseFloat(adjustedKg.toFixed(2)),
    zupcoKmEquivalent: zupcoKm,
    cityName: city.name,
    transportLabel: city.transportLabel,
  };
}
