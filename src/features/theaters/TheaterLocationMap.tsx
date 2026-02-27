import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";

type MapCoordinates = {
    latitude: number;
    longitude: number;
};

type TheaterLocationMapProps = {
    latitude?: number;
    longitude?: number;
    onChange: (coords: MapCoordinates) => void;
    heightClassName?: string;
};

type MapLibreGlobal = {
    Map: new (options: {
        container: HTMLElement;
        style: string;
        center: [number, number];
        zoom: number;
    }) => MapInstance;
    Marker: new (options: { draggable: boolean }) => MarkerInstance;
    NavigationControl: new () => unknown;
};

type MarkerInstance = {
    setLngLat: (coords: [number, number]) => MarkerInstance;
    addTo: (map: MapInstance) => MarkerInstance;
    on: (event: "dragend", handler: () => void) => void;
    getLngLat: () => { lng: number; lat: number };
    remove: () => void;
};

type MapInstance = {
    addControl: (
        control: unknown,
        position: "top-right" | "top-left" | "bottom-right" | "bottom-left",
    ) => void;
    on: (event: "click", handler: (event: MapClickEvent) => void) => void;
    easeTo: (options: { center: [number, number]; duration: number }) => void;
    remove: () => void;
};

type MapClickEvent = {
    lngLat: {
        lng: number;
        lat: number;
    };
};

declare global {
    interface Window {
        maplibregl?: MapLibreGlobal;
        __mapLibreLoadingPromise?: Promise<void>;
    }
}

const MAPLIBRE_JS_URL = "https://unpkg.com/maplibre-gl@5.9.0/dist/maplibre-gl.js";
const MAPLIBRE_CSS_URL =
    "https://unpkg.com/maplibre-gl@5.9.0/dist/maplibre-gl.css";

const DEFAULT_STADIA_STYLE_URL =
    "https://tiles.stadiamaps.com/styles/osm_bright.json";
const FALLBACK_STYLE_URL = "https://demotiles.maplibre.org/style.json";
const DEFAULT_CENTER: [number, number] = [121.0244, 14.5547];
const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

type GeocodeItem = {
    display_name: string;
    lat: string;
    lon: string;
};

function resolveStyleUrl() {
    const configured = import.meta.env.VITE_STADIA_MAP_STYLE_URL;
    if (!configured) return DEFAULT_STADIA_STYLE_URL;
    if (configured.includes("YOUR_STADIA_API_KEY")) return FALLBACK_STYLE_URL;
    return configured;
}

function ensureMapLibreLoaded(): Promise<void> {
    if (typeof window === "undefined") return Promise.resolve();
    if (window.maplibregl) return Promise.resolve();
    if (window.__mapLibreLoadingPromise) return window.__mapLibreLoadingPromise;

    window.__mapLibreLoadingPromise = new Promise<void>((resolve, reject) => {
        const existingCss = document.querySelector(
            `link[data-maplibre-css="true"]`,
        );
        if (!existingCss) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = MAPLIBRE_CSS_URL;
            link.dataset.maplibreCss = "true";
            document.head.appendChild(link);
        }

        const existingScript = document.querySelector(
            `script[data-maplibre-js="true"]`,
        ) as HTMLScriptElement | null;

        if (existingScript) {
            existingScript.addEventListener("load", () => resolve(), {
                once: true,
            });
            existingScript.addEventListener(
                "error",
                () => reject(new Error("Failed to load MapLibre script.")),
                { once: true },
            );
            return;
        }

        const script = document.createElement("script");
        script.src = MAPLIBRE_JS_URL;
        script.async = true;
        script.dataset.maplibreJs = "true";
        script.onload = () => resolve();
        script.onerror = () =>
            reject(new Error("Failed to load MapLibre script."));
        document.body.appendChild(script);
    });

    return window.__mapLibreLoadingPromise;
}

export default function TheaterLocationMap({
    latitude,
    longitude,
    onChange,
    heightClassName = "h-80",
}: TheaterLocationMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapInstance | null>(null);
    const markerRef = useRef<MarkerInstance | null>(null);
    const [mapError, setMapError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<GeocodeItem[]>([]);
    const initialLatitudeRef = useRef(latitude);
    const initialLongitudeRef = useRef(longitude);

    const styleUrl = useMemo(() => resolveStyleUrl(), []);
    const hasValidCoordinates =
        typeof latitude === "number" &&
        Number.isFinite(latitude) &&
        typeof longitude === "number" &&
        Number.isFinite(longitude);

    const upsertMarker = useCallback(
        (lng: number, lat: number, notify: boolean, shouldCenter = false) => {
            const map = mapRef.current;
            const maplibregl = window.maplibregl;
            if (!map || !maplibregl) return;

            const roundedLng = Number(lng.toFixed(6));
            const roundedLat = Number(lat.toFixed(6));

            if (!markerRef.current) {
                markerRef.current = new maplibregl.Marker({
                    draggable: true,
                })
                    .setLngLat([roundedLng, roundedLat])
                    .addTo(map);

                markerRef.current.on("dragend", () => {
                    const marker = markerRef.current;
                    if (!marker) return;
                    const position = marker.getLngLat();
                    onChange({
                        latitude: Number(position.lat.toFixed(6)),
                        longitude: Number(position.lng.toFixed(6)),
                    });
                });
            } else {
                markerRef.current.setLngLat([roundedLng, roundedLat]);
            }

            if (shouldCenter) {
                map.easeTo({ center: [roundedLng, roundedLat], duration: 300 });
            }

            if (notify) {
                onChange({ latitude: roundedLat, longitude: roundedLng });
            }
        },
        [onChange],
    );

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                await ensureMapLibreLoaded();
                if (!mounted || !mapContainerRef.current || !window.maplibregl) return;

                const maplibregl = window.maplibregl;
                const hasInitialCoordinates =
                    typeof initialLatitudeRef.current === "number" &&
                    Number.isFinite(initialLatitudeRef.current) &&
                    typeof initialLongitudeRef.current === "number" &&
                    Number.isFinite(initialLongitudeRef.current);
                const center: [number, number] = hasInitialCoordinates
                    ? [
                          initialLongitudeRef.current as number,
                          initialLatitudeRef.current as number,
                      ]
                    : DEFAULT_CENTER;

                const map = new maplibregl.Map({
                    container: mapContainerRef.current,
                    style: styleUrl,
                    center,
                    zoom: hasInitialCoordinates ? 15 : 11,
                });
                mapRef.current = map;

                map.addControl(new maplibregl.NavigationControl(), "top-right");

                if (hasInitialCoordinates) {
                    upsertMarker(
                        initialLongitudeRef.current as number,
                        initialLatitudeRef.current as number,
                        false,
                    );
                }

                map.on("click", (event) => {
                    upsertMarker(event.lngLat.lng, event.lngLat.lat, true);
                });
            } catch (error) {
                if (!mounted) return;
                setMapError(
                    error instanceof Error
                        ? error.message
                        : "Unable to initialize map.",
                );
            }
        })();

        return () => {
            mounted = false;
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
            }
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [styleUrl, upsertMarker]);

    useEffect(() => {
        if (!mapRef.current || !markerRef.current || !hasValidCoordinates) return;

        const nextLngLat: [number, number] = [longitude as number, latitude as number];
        upsertMarker(nextLngLat[0], nextLngLat[1], false, true);
    }, [hasValidCoordinates, latitude, longitude, upsertMarker]);

    const handleSearch = async () => {
        const query = searchQuery.trim();
        if (!query) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const url = new URL(NOMINATIM_SEARCH_URL);
            url.searchParams.set("q", query);
            url.searchParams.set("format", "jsonv2");
            url.searchParams.set("limit", "8");
            url.searchParams.set("countrycodes", "ph");
            url.searchParams.set("addressdetails", "1");

            const response = await fetch(url.toString(), {
                headers: {
                    "Accept-Language": "en",
                },
            });
            if (!response.ok) {
                throw new Error("Unable to search locations.");
            }

            const data = (await response.json()) as GeocodeItem[];
            setSearchResults(data);
        } catch (error) {
            setMapError(
                error instanceof Error
                    ? error.message
                    : "Unable to search locations.",
            );
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSearchResult = (item: GeocodeItem) => {
        const lat = Number(item.lat);
        const lng = Number(item.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        upsertMarker(lng, lat, true, true);
        setSearchQuery(item.display_name);
        setSearchResults([]);
    };

    if (mapError) {
        return (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {mapError}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            void handleSearch();
                        }
                    }}
                    placeholder="Search place in PH (e.g. SM Fairview, SM North)"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => void handleSearch()}
                    disabled={isSearching}
                >
                    {isSearching ? "Searching..." : "Search"}
                </Button>
            </div>

            {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-md border bg-background">
                    {searchResults.map((item) => (
                        <button
                            key={`${item.lat}-${item.lon}-${item.display_name}`}
                            type="button"
                            className="w-full border-b px-3 py-2 text-left text-sm hover:bg-muted"
                            onClick={() => handleSelectSearchResult(item)}
                        >
                            {item.display_name}
                        </button>
                    ))}
                </div>
            )}

            <div
                ref={mapContainerRef}
                className={`w-full rounded-md border ${heightClassName}`}
            />
        </div>
    );
}
