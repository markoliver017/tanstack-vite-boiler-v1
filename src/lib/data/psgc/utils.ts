// src/lib/address-utils.ts
import regions from "./regions.json";
import provinces from "./provinces.json";
import cities from "./cities.json";
import type { PSGCRegion, PSGCProvince, PSGCCity } from "./types";

const LUZON_REGION_KEYS = ["NCR", "CAR", "I", "II", "III", "IV-A", "IV-B", "V"];

export const addressUtils = {
    getAllRegions: (): PSGCRegion[] =>
        regions.sort((a, b) => a.name.localeCompare(b.name)),
    // Get all regions in Luzon
    getLuzonRegions: (): PSGCRegion[] => {
        return (regions as PSGCRegion[]).filter((r) =>
            LUZON_REGION_KEYS.includes(r.key),
        );
    },

    // Get provinces filtered by the Luzon regions
    getLuzonProvinces: (): PSGCProvince[] => {
        return (provinces as PSGCProvince[]).filter((p) =>
            LUZON_REGION_KEYS.includes(p.region),
        );
    },

    getProvincesByRegion: (regionKey: string): PSGCProvince[] => {
        return provinces
            .filter((p) => p.region === regionKey)
            .sort((a, b) => a.name.localeCompare(b.name));
    },

    // Get cities based on the province key (e.g., "MM" or "ABR")
    getCitiesByProvince: (provinceKey: string): PSGCCity[] => {
        return (cities as PSGCCity[]).filter((c) => c.province === provinceKey);
    },
};
