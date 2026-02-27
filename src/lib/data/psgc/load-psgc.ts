import type {
    PSGCBarangay,
    PSGCCity,
    PSGCProvince,
    PSGCRegion,
} from "./types";

export type PsgcDataset = {
    regions: PSGCRegion[];
    provinces: PSGCProvince[];
    cities: PSGCCity[];
    provincesByRegion: Record<string, string[]>;
    citiesByProvince: Record<string, string[]>;
    barangaysByCityMunicipality: Record<string, string[]>;
};

let barangayNameMapCache: Map<string, string> | null = null;

export async function loadPsgcDataset(): Promise<PsgcDataset> {
    const [
        regions,
        provinces,
        cities,
        provincesByRegion,
        citiesByProvince,
        barangaysByCityMunicipality,
    ] = await Promise.all([
        import("./regions.json"),
        import("./provinces.json"),
        import("./cities.json"),
        import("./provinces-by-region.json"),
        import("./cities-by-province.json"),
        import("./barangays-by-city-municipality.json"),
    ]);

    return {
        regions: regions.default as PSGCRegion[],
        provinces: provinces.default as PSGCProvince[],
        cities: cities.default as PSGCCity[],
        provincesByRegion: provincesByRegion.default as Record<string, string[]>,
        citiesByProvince: citiesByProvince.default as Record<string, string[]>,
        barangaysByCityMunicipality: barangaysByCityMunicipality.default as Record<
            string,
            string[]
        >,
    };
}

export async function loadBarangayNamesByCodes(
    barangayCodes: string[],
): Promise<Array<{ code: string; name: string }>> {
    if (!barangayCodes.length) return [];

    if (!barangayNameMapCache) {
        const barangays = await import("./barangays.json");
        barangayNameMapCache = new Map(
            (barangays.default as PSGCBarangay[]).map((item) => [
                item.code,
                item.name,
            ]),
        );
    }

    return barangayCodes
        .map((code) => ({
            code,
            name: barangayNameMapCache?.get(code) || code,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}
