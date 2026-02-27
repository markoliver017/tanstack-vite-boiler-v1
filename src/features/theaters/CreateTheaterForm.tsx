import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { fetchList } from "@/lib/api.client";
import { useNavigate } from "@tanstack/react-router";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import {
    Combobox,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/shadcn-ui/combobox";
import { Loader2 } from "lucide-react";
import {
    createTheaterSchema,
    type CreateTheaterValues,
    type TheaterResponse,
} from "./zTheatersSchema";
import { useCreateTheater, useUpdateTheater } from "./mutations";
import {
    loadBarangayNamesByCodes,
    loadPsgcDataset,
    type PsgcDataset,
} from "@/lib/data/psgc/load-psgc";
import FormDebugger from "@/components/shared/FormDebugger";
import TheaterLocationMap from "./TheaterLocationMap";

interface TheaterFormProps {
    initialData?: TheaterResponse;
    defaultTheaterGroupId?: number;
    lockTheaterGroup?: boolean;
}

type TheaterGroupOption = {
    id: number;
    name: string;
};

type TaxRuleOption = {
    id: number;
    name: string;
    taxRate: string;
};

type LocationComboboxItem = {
    value: string;
    label: string;
};

function normalizeName(name?: string | null) {
    return (name || "")
        .replace(/^City of\s+/i, "")
        .replace(/\s+City$/i, "")
        .trim()
        .toLowerCase();
}

export default function TheaterForm({
    initialData,
    defaultTheaterGroupId,
    lockTheaterGroup = false,
}: TheaterFormProps) {
    const navigate = useNavigate();
    const isEdit = Boolean(initialData);

    const createMutation = useCreateTheater();
    const updateMutation = useUpdateTheater();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const form = useForm<CreateTheaterValues>({
        resolver: zodResolver(createTheaterSchema),
        defaultValues: {
            theaterGroupId:
                initialData?.theaterGroupId ?? defaultTheaterGroupId,
            taxRuleId: initialData?.taxRuleId,
            name: initialData?.name || "",
            address: initialData?.address || "",
            city: initialData?.city || "",
            province: initialData?.province || "",
            latitude: initialData?.latitude
                ? Number(initialData.latitude)
                : undefined,
            longitude: initialData?.longitude
                ? Number(initialData.longitude)
                : undefined,
            isActive: initialData?.isActive ?? true,
        },
    });

    useEffect(() => {
        form.reset({
            theaterGroupId:
                initialData?.theaterGroupId ?? defaultTheaterGroupId,
            taxRuleId: initialData?.taxRuleId,
            name: initialData?.name || "",
            address: initialData?.address || "",
            city: initialData?.city || "",
            province: initialData?.province || "",
            latitude: initialData?.latitude
                ? Number(initialData.latitude)
                : undefined,
            longitude: initialData?.longitude
                ? Number(initialData.longitude)
                : undefined,
            isActive: initialData?.isActive ?? true,
        });
    }, [defaultTheaterGroupId, form, initialData]);

    const { data: theaterGroupsData, isLoading: isLoadingGroups } = useQuery({
        queryKey: ["theater-groups-list"],
        queryFn: () =>
            fetchList<TheaterGroupOption[]>("/theater-groups?_limit=100"),
    });

    const { data: taxRulesData, isLoading: isLoadingTaxRules } = useQuery({
        queryKey: ["tax-rules-list"],
        queryFn: () => fetchList<TaxRuleOption[]>("/tax-rules?_limit=100"),
    });

    const [psgc, setPsgc] = useState<PsgcDataset | null>(null);
    const [isLoadingPsgc, setIsLoadingPsgc] = useState(true);

    const [selectedRegionKey, setSelectedRegionKey] = useState("");
    const [selectedProvinceKey, setSelectedProvinceKey] = useState("");
    const [selectedCityCode, setSelectedCityCode] = useState("");
    const [selectedBarangayCode, setSelectedBarangayCode] = useState("");
    const [barangayOptions, setBarangayOptions] = useState<
        Array<{ code: string; name: string }>
    >([]);
    const [hasInitializedLocation, setHasInitializedLocation] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const dataset = await loadPsgcDataset();
                if (!mounted) return;
                setPsgc(dataset);
            } finally {
                if (mounted) setIsLoadingPsgc(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        setSelectedRegionKey("");
        setSelectedProvinceKey("");
        setSelectedCityCode("");
        setSelectedBarangayCode("");
        setHasInitializedLocation(false);
    }, [initialData?.id]);

    useEffect(() => {
        if (!psgc || hasInitializedLocation) return;

        const province = psgc.provinces.find(
            (item) =>
                normalizeName(item.name) ===
                    normalizeName(initialData?.province) ||
                item.key === initialData?.province,
        );

        if (province) {
            setSelectedRegionKey(province.region);
            setSelectedProvinceKey(province.key);
            form.setValue("province", province.name);

            const city = psgc.cities.find(
                (item) =>
                    item.province === province.key &&
                    normalizeName(item.name) ===
                        normalizeName(initialData?.city),
            );
            if (city?.code) {
                setSelectedCityCode(city.code);
                form.setValue("city", city.name);
            }
        }

        setHasInitializedLocation(true);
    }, [
        form,
        hasInitializedLocation,
        initialData?.city,
        initialData?.province,
        psgc,
    ]);

    const regions = useMemo(
        () =>
            (psgc?.regions || [])
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name)),
        [psgc],
    );

    const provinceOptions = useMemo(() => {
        if (!psgc || !selectedRegionKey) return [];
        const keys = psgc.provincesByRegion[selectedRegionKey] || [];
        return psgc.provinces
            .filter((item) => keys.includes(item.key))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [psgc, selectedRegionKey]);

    const cityOptions = useMemo(() => {
        if (!psgc || !selectedProvinceKey) return [];
        const cityCodes = psgc.citiesByProvince[selectedProvinceKey] || [];
        return psgc.cities
            .filter((item) => item.code && cityCodes.includes(item.code))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [psgc, selectedProvinceKey]);

    useEffect(() => {
        if (!psgc || !selectedCityCode) {
            setBarangayOptions([]);
            return;
        }

        let mounted = true;
        const barangayCodes =
            psgc.barangaysByCityMunicipality[selectedCityCode] || [];

        loadBarangayNamesByCodes(barangayCodes).then((result) => {
            if (!mounted) return;
            setBarangayOptions(result);
        });

        return () => {
            mounted = false;
        };
    }, [psgc, selectedCityCode]);

    const regionItems = useMemo<LocationComboboxItem[]>(
        () =>
            regions.map((region) => ({
                value: region.key,
                label: region.name,
            })),
        [regions],
    );

    const provinceItems = useMemo<LocationComboboxItem[]>(
        () =>
            provinceOptions.map((province) => ({
                value: province.key,
                label: province.name,
            })),
        [provinceOptions],
    );

    const cityItems = useMemo<LocationComboboxItem[]>(
        () =>
            cityOptions.map((city) => ({
                value: city.code || city.name,
                label: city.name,
            })),
        [cityOptions],
    );

    const barangayItems = useMemo<LocationComboboxItem[]>(
        () =>
            barangayOptions.map((barangay) => ({
                value: barangay.code,
                label: barangay.name,
            })),
        [barangayOptions],
    );

    const locationFilter = (item: LocationComboboxItem, query: string) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            item.label.toLowerCase().includes(q) ||
            item.value.toLowerCase().includes(q)
        );
    };

    const selectedRegionItem =
        regionItems.find((item) => item.value === selectedRegionKey) || null;
    const selectedProvinceItem =
        provinceItems.find((item) => item.value === selectedProvinceKey) ||
        null;
    const selectedCityItem =
        cityItems.find((item) => item.value === selectedCityCode) || null;
    const selectedBarangayItem =
        barangayItems.find((item) => item.value === selectedBarangayCode) ||
        null;

    const watchedLatitude = useWatch({
        control: form.control,
        name: "latitude",
    });
    const watchedLongitude = useWatch({
        control: form.control,
        name: "longitude",
    });

    const handleMapCoordinateChange = useCallback(
        (coords: { latitude: number; longitude: number }) => {
            form.setValue("latitude", coords.latitude, {
                shouldDirty: true,
                shouldValidate: true,
            });
            form.setValue("longitude", coords.longitude, {
                shouldDirty: true,
                shouldValidate: true,
            });
        },
        [form],
    );

    const onSubmit = async (data: CreateTheaterValues) => {
        const selectedBarangay = barangayOptions.find(
            (item) => item.code === selectedBarangayCode,
        );

        const payload: CreateTheaterValues = {
            ...data,
            address:
                selectedBarangay &&
                !data.address.includes(selectedBarangay.name)
                    ? `Brgy. ${selectedBarangay.name}, ${data.address}`
                    : data.address,
        };

        const group =
            theaterGroupsData?.data.find(
                (item) => item.id === payload.theaterGroupId,
            )?.name || payload.theaterGroupId;
        const taxRule =
            taxRulesData?.data.find((item) => item.id === payload.taxRuleId)
                ?.name || payload.taxRuleId;

        const result = await Swal.fire({
            title: isEdit ? "Update Theater?" : "Create Theater?",
            html: `
        <div class="text-left text-sm space-y-2">
            <p><strong>Name:</strong> ${payload.name}</p>
            <p><strong>Group:</strong> ${group}</p>
            <p><strong>Tax Rule:</strong> ${taxRule}</p>
            <p><strong>City:</strong> ${payload.city}</p>
            <p><strong>Location:</strong> ${payload.latitude}, ${payload.longitude}</p>
            <div class="flex items-center gap-2 mt-4 bg-muted/50 p-2 rounded">
                <input type="checkbox" id="confirm-check" class="w-4 h-4 cursor-pointer" />
                <label for="confirm-check" class="text-xs cursor-pointer select-none">I verify that the information above is correct.</label>
            </div>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: isEdit ? "Update" : "Create",
            preConfirm: () => {
                const checkbox = Swal.getPopup()?.querySelector(
                    "#confirm-check",
                ) as HTMLInputElement;
                if (!checkbox?.checked) {
                    Swal.showValidationMessage(
                        "Please verify the data to proceed",
                    );
                    return false;
                }
                return true;
            },
        });

        if (!result.isConfirmed) return;

        if (isEdit && initialData) {
            updateMutation.mutate(
                { id: String(initialData.id), data: payload },
                {
                    onSuccess: () => {
                        Swal.fire(
                            "Success",
                            "Theater updated successfully",
                            "success",
                        );
                        navigate({ to: "/theaters" });
                    },
                    onError: (err) => {
                        Swal.fire("Error", err.message, "error");
                    },
                },
            );
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                Swal.fire("Success", "Theater created successfully", "success");
                navigate({ to: "/theaters" });
            },
            onError: (err) => {
                Swal.fire("Error", err.message, "error");
            },
        });
    };

    if (isLoadingGroups || isLoadingTaxRules || isLoadingPsgc) {
        return (
            <div className="p-4 flex items-center justify-center">
                <Loader2 className="animate-spin" /> Loading metadata...
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-2xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="theaterGroupId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Theater Group</FormLabel>
                                <Select
                                    disabled={lockTheaterGroup}
                                    onValueChange={(value) =>
                                        field.onChange(Number(value))
                                    }
                                    value={
                                        field.value
                                            ? String(field.value)
                                            : undefined
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a group" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {theaterGroupsData?.data.map(
                                            (group) => (
                                                <SelectItem
                                                    key={group.id}
                                                    value={String(group.id)}
                                                >
                                                    {group.name}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="taxRuleId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax Rule</FormLabel>
                                <Select
                                    onValueChange={(value) =>
                                        field.onChange(Number(value))
                                    }
                                    value={
                                        field.value
                                            ? String(field.value)
                                            : undefined
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a tax rule" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {taxRulesData?.data.map((rule) => (
                                            <SelectItem
                                                key={rule.id}
                                                value={String(rule.id)}
                                            >
                                                {rule.name} ({rule.taxRate}%)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Determines tax calculation logic.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Theater Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. SM City Fairview"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Full street address"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                If selected, barangay is prefixed into address
                                on save.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Combobox
                            items={regionItems}
                            value={selectedRegionItem}
                            itemToStringLabel={(item) => item.value}
                            isItemEqualToValue={(item, value) =>
                                item.value === value.value
                            }
                            filter={locationFilter}
                            onValueChange={(value) => {
                                if (!value) return;
                                setSelectedRegionKey(value.value);
                                setSelectedProvinceKey("");
                                setSelectedCityCode("");
                                setSelectedBarangayCode("");
                                form.setValue("province", "");
                                form.setValue("city", "");
                            }}
                        >
                            <FormControl>
                                <ComboboxInput placeholder="Search and select region" />
                            </FormControl>
                            <ComboboxContent>
                                <ComboboxEmpty>No regions found.</ComboboxEmpty>
                                <ComboboxList>
                                    <ComboboxCollection>
                                        {(item: LocationComboboxItem) => (
                                            <ComboboxItem
                                                key={item.value}
                                                value={item}
                                            >
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxCollection>
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="province"
                        render={() => (
                            <FormItem>
                                <FormLabel>Province</FormLabel>
                                <Combobox
                                    disabled={!selectedRegionKey}
                                    items={provinceItems}
                                    value={selectedProvinceItem}
                                    itemToStringLabel={(item) => item.label}
                                    isItemEqualToValue={(item, value) =>
                                        item.value === value.value
                                    }
                                    filter={locationFilter}
                                    onValueChange={(value) => {
                                        if (!value) return;
                                        setSelectedProvinceKey(value.value);
                                        setSelectedCityCode("");
                                        setSelectedBarangayCode("");
                                        const province = provinceOptions.find(
                                            (item) => item.key === value.value,
                                        );
                                        form.setValue(
                                            "province",
                                            province?.name || "",
                                        );
                                        form.setValue("city", "");
                                    }}
                                >
                                    <FormControl>
                                        <ComboboxInput
                                            placeholder="Search and select province"
                                            disabled={!selectedRegionKey}
                                        />
                                    </FormControl>
                                    <ComboboxContent>
                                        <ComboboxEmpty>
                                            No provinces found.
                                        </ComboboxEmpty>
                                        <ComboboxList>
                                            <ComboboxCollection>
                                                {(
                                                    item: LocationComboboxItem,
                                                ) => (
                                                    <ComboboxItem
                                                        key={item.value}
                                                        value={item}
                                                    >
                                                        {item.label}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxCollection>
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={() => (
                            <FormItem>
                                <FormLabel>City / Municipality</FormLabel>
                                <Combobox
                                    disabled={!selectedProvinceKey}
                                    items={cityItems}
                                    value={selectedCityItem}
                                    itemToStringLabel={(item) => item.label}
                                    isItemEqualToValue={(item, value) =>
                                        item.value === value.value
                                    }
                                    filter={locationFilter}
                                    onValueChange={(value) => {
                                        if (!value) return;
                                        setSelectedCityCode(value.value);
                                        setSelectedBarangayCode("");
                                        const city = cityOptions.find(
                                            (item) => item.code === value.value,
                                        );
                                        form.setValue("city", city?.name || "");
                                    }}
                                >
                                    <FormControl>
                                        <ComboboxInput
                                            placeholder="Search and select city / municipality"
                                            disabled={!selectedProvinceKey}
                                        />
                                    </FormControl>
                                    <ComboboxContent>
                                        <ComboboxEmpty>
                                            No cities found.
                                        </ComboboxEmpty>
                                        <ComboboxList>
                                            <ComboboxCollection>
                                                {(
                                                    item: LocationComboboxItem,
                                                ) => (
                                                    <ComboboxItem
                                                        key={item.value}
                                                        value={item}
                                                    >
                                                        {item.label}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxCollection>
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Barangay</FormLabel>
                        <Combobox
                            disabled={!selectedCityCode}
                            items={barangayItems}
                            value={selectedBarangayItem}
                            itemToStringLabel={(item) => item.label}
                            isItemEqualToValue={(item, value) =>
                                item.value === value.value
                            }
                            filter={locationFilter}
                            onValueChange={(value) => {
                                if (!value) return;
                                setSelectedBarangayCode(value.value);
                            }}
                        >
                            <FormControl>
                                <ComboboxInput
                                    placeholder="Search and select barangay"
                                    disabled={!selectedCityCode}
                                />
                            </FormControl>
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    No barangays found.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    <ComboboxCollection>
                                        {(item: LocationComboboxItem) => (
                                            <ComboboxItem
                                                key={item.value}
                                                value={item}
                                            >
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxCollection>
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FormDescription>
                            Optional but useful for precise location metadata.
                        </FormDescription>
                    </FormItem>
                </div>

                <FormItem>
                    <FormLabel>Map Location Picker</FormLabel>
                    <TheaterLocationMap
                        latitude={
                            typeof watchedLatitude === "number"
                                ? watchedLatitude
                                : undefined
                        }
                        longitude={
                            typeof watchedLongitude === "number"
                                ? watchedLongitude
                                : undefined
                        }
                        onChange={handleMapCoordinateChange}
                    />
                    <FormDescription>
                        Click the map or drag the marker to set latitude and
                        longitude.
                    </FormDescription>
                </FormItem>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="any"
                                        placeholder="14.123456"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.valueAsNumber,
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="any"
                                        placeholder="121.123456"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.valueAsNumber,
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Active Status</FormLabel>
                                <FormDescription>
                                    Inactive theaters won't appear in selection
                                    lists.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate({ to: "/theaters" })}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={isPending}
                    >
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEdit ? "Update Theater" : "Create Theater"}
                    </Button>
                </div>
            </form>
            <FormDebugger form={form} />
        </Form>
    );
}
