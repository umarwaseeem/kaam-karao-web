import { storage, KEYS } from './storage.js';

const NOMINATIM = 'https://nominatim.openstreetmap.org/reverse';

export function loadCachedLocation() {
  const lat = parseFloat(storage.get(KEYS.USER_LAT));
  const lng = parseFloat(storage.get(KEYS.USER_LNG));
  if (!lat || !lng) return null;
  return {
    lat,
    lng,
    areaLabel: storage.get(KEYS.USER_AREA_LABEL) ?? null,
    updatedAt: storage.get(KEYS.USER_LOCATION_UPDATED_AT) ?? null,
  };
}

export function cacheLocation({ lat, lng, areaLabel }) {
  storage.set(KEYS.USER_LAT, lat);
  storage.set(KEYS.USER_LNG, lng);
  storage.set(KEYS.USER_AREA_LABEL, areaLabel ?? '');
  storage.set(KEYS.USER_LOCATION_UPDATED_AT, new Date().toISOString());
}

export function clearCachedLocation() {
  [KEYS.USER_LAT, KEYS.USER_LNG, KEYS.USER_AREA_LABEL, KEYS.USER_LOCATION_UPDATED_AT].forEach(
    (k) => storage.remove(k),
  );
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `${NOMINATIM}?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address ?? {};
    const parts = [a.suburb, a.city_district, a.city || a.town || a.village].filter(Boolean);
    return parts.join(', ') || data.display_name?.split(',').slice(0, 2).join(', ') || null;
  } catch {
    return null;
  }
}

export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const areaLabel = await reverseGeocode(lat, lng);
        const location = { lat, lng, areaLabel, updatedAt: new Date().toISOString() };
        cacheLocation(location);
        resolve(location);
      },
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  });
}
