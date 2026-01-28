// src/types/address.ts
export interface PSGCRegion {
    name: string;
    long: string;
    key: string;
}

export interface PSGCProvince {
    name: string;
    region: string;
    key: string;
}

export interface PSGCCity {
    name: string;
    province: string;
    city?: boolean;
}
