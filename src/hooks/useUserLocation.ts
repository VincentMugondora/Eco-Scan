/**
 * useUserLocation.ts — Resolves the authenticated user's city from Supabase metadata.
 * Reads the {lat, lng} stored during signup and runs it through getCityFromCoords().
 */

import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { getCityFromCoords, type CityInfo } from "../utils/geo";

// Harare as the default fallback city
const DEFAULT_CITY: CityInfo = {
  name: "Harare",
  country: "Zimbabwe",
  transportLabel: "Zupco bus",
  transitGramsPerKm: 68,
  logisticsMultiplier: 1.0,
};

interface UseUserLocationResult {
  city: CityInfo;
  lat: number | null;
  lng: number | null;
  loading: boolean;
}

export function useUserLocation(): UseUserLocationResult {
  const [city, setCity] = useState<CityInfo>(DEFAULT_CITY);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolve = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const meta = user?.user_metadata;

        if (meta?.lat != null && meta?.lng != null) {
          const resolvedCity = getCityFromCoords(meta.lat, meta.lng);
          setLat(meta.lat);
          setLng(meta.lng);
          setCity(resolvedCity);
        }
      } catch (err) {
        console.error("useUserLocation error:", err);
      } finally {
        setLoading(false);
      }
    };

    resolve();
  }, []);

  return { city, lat, lng, loading };
}
