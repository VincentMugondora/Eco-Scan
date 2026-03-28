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
