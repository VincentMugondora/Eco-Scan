/**
 * geo.ts – Browser geolocation utility for Eco-Scan.
 * Returns high-accuracy coordinates, falling back to Harare, Zimbabwe
 * if the user denies permission or the browser doesn't support it.
 */

export interface GeoResult {
  lat: number;
  lng: number;
  isDefault: boolean;       // true when the user denied permission
  accuracy?: number;        // metres, if available
  region: string;           // human-readable region label
}

/** Harare, Zimbabwe – the default fallback coordinate */
const DEFAULT: GeoResult = {
  lat: -17.8252,
  lng: 31.0335,
  isDefault: true,
  region: "Southern Africa",
};

/**
 * Resolve a coarse region label from coordinates.
 * Extend this lookup as needed.
 */
function resolveRegion(lat: number, lng: number): string {
  // Africa (very rough bounding box)
  if (lat >= -35 && lat <= 37 && lng >= -18 && lng <= 52) {
    if (lat <= 0) return "Southern Africa";
    if (lat <= 15) return "Central/East Africa";
    return "North Africa";
  }
  if (lat >= -55 && lat <= 15 && lng >= -82 && lng <= -34) return "South America";
  if (lat >= 15  && lat <= 72 && lng >= -140 && lng <= -52) return "North America";
  if (lat >= 35  && lat <= 72 && lng >= -10  && lng <= 40)  return "Europe";
  if (lat >= -10 && lat <= 55 && lng >= 40   && lng <= 150) return "Asia";
  if (lat <= -10 && lng >= 110)                              return "Oceania";
  return "Global";
}

/**
 * Request the user's location.  
 * Resolves immediately with a default if permission is denied.
 */
export function getUserLocation(): Promise<GeoResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported. Using default.");
      resolve(DEFAULT);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng, accuracy } = position.coords;
        resolve({
          lat,
          lng,
          isDefault: false,
          accuracy,
          region: resolveRegion(lat, lng),
        });
      },
      (error) => {
        console.warn(`Geolocation denied (code ${error.code}). Using Harare default.`);
        resolve(DEFAULT);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,       // 8 s max
        maximumAge: 60000,   // use a cached position if < 1 min old
      }
    );
  });
}

// ──────────────────────────────────────────────────────────────
// City resolution — bounding-box lookup (no external API)
// ──────────────────────────────────────────────────────────────

export interface CityInfo {
  name: string;                // display name, e.g. "Harare"
  country: string;             // e.g. "Zimbabwe"
  transportLabel: string;      // local transport context for UI copy
  /** grams CO2e emitted per passenger-km on local transit */
  transitGramsPerKm: number;
  /** regional logistics multiplier — rural areas have higher supply-chain cost */
  logisticsMultiplier: number;
}

const CITY_BOXES: Array<{
  city: CityInfo;
  minLat: number; maxLat: number;
  minLng: number; maxLng: number;
}> = [
  {
    city: { name: "Harare", country: "Zimbabwe", transportLabel: "Zupco bus", transitGramsPerKm: 68, logisticsMultiplier: 1.0 },
    minLat: -18.1, maxLat: -17.5, minLng: 30.8, maxLng: 31.4,
  },
  {
    city: { name: "Bulawayo", country: "Zimbabwe", transportLabel: "Zupco bus", transitGramsPerKm: 72, logisticsMultiplier: 1.15 },
    minLat: -20.3, maxLat: -19.9, minLng: 28.4, maxLng: 28.8,
  },
  {
    city: { name: "Gweru", country: "Zimbabwe", transportLabel: "commuter omnibus", transitGramsPerKm: 85, logisticsMultiplier: 1.25 },
    minLat: -19.6, maxLat: -19.3, minLng: 29.7, maxLng: 30.0,
  },
  {
    city: { name: "Mutare", country: "Zimbabwe", transportLabel: "commuter omnibus", transitGramsPerKm: 90, logisticsMultiplier: 1.3 },
    minLat: -19.1, maxLat: -18.8, minLng: 32.5, maxLng: 32.8,
  },
  {
    city: { name: "Masvingo", country: "Zimbabwe", transportLabel: "commuter omnibus", transitGramsPerKm: 95, logisticsMultiplier: 1.4 },
    minLat: -20.2, maxLat: -19.9, minLng: 30.7, maxLng: 31.0,
  },
];

const FALLBACK_CITY: CityInfo = {
  name: "Your Region",
  country: "Zimbabwe",
  transportLabel: "local transport",
  transitGramsPerKm: 100,
  logisticsMultiplier: 1.5,
};

/**
 * Resolve a CityInfo from lat/lng using bounding-box lookup.
 * Falls back to FALLBACK_CITY if no box matches.
 */
export function getCityFromCoords(lat: number, lng: number): CityInfo {
  for (const box of CITY_BOXES) {
    if (
      lat >= box.minLat && lat <= box.maxLat &&
      lng >= box.minLng && lng <= box.maxLng
    ) {
      return box.city;
    }
  }
  return FALLBACK_CITY;
}
