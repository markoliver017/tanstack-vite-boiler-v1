// src/types/address.ts
export interface PSGCRegion {
    name: string;
    long: string;
    key: string;
    code?: string;
    islandGroupCode?: string;
}

export interface PSGCProvince {
    name: string;
    region: string;
    key: string;
    code?: string;
}

export interface PSGCCity {
    name: string;
    province: string;
    city?: boolean;
    code?: string;
    regionCode?: string;
}

export interface PSGCBarangay {
    name: string;
    cityMunicipalityCode: string;
    code: string;
}
