// src/features/patients/CreatePatientForm.tsx

import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/shadcn-ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
// import { apiRequest } from "@/lib/api.client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, type PatientFormValues } from "./zPatientsSchema";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { height_units, weight_units } from "./form-data";

import FormDebugger from "@/components/shared/FormDebugger";
import { addressUtils } from "@/lib/data/psgc/utils";
import { useEffect, useMemo } from "react";

// Define the patient schema using Zod

export function CreatePatientForm() {
    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientSchema),
        mode: "onChange",
        defaultValues: {
            // patient_id_number: "PT-2026-0001",
            // first_name: "",
            // middle_name: undefined,
            // last_name: "",
            // suffix: undefined,
            // date_of_birth: undefined,
            // sex: undefined,
            // email: undefined,
            // contact_number: "",
            // weight: undefined,
            // height: undefined,
            // allergies: undefined,
            // comorbidities: undefined,
            // blood_type: undefined,
            // emergency_contact_name: "",
            // emergency_contact_number: undefined,
            // address: "",
            // city: "",
            // province: "",
            // region: "NCR",
            patient_id_number: "PT-2026-0001",
            first_name: "Mark",
            middle_name: "Carmesis",
            last_name: "Roman",
            suffix: "Jr.",
            date_of_birth: "1993-04-23",
            sex: "female",
            email: "juan@example.com",
            contact_number: "09123456789",
            weight: 3,
            height: 4,
            allergies: "Shrimp",
            comorbidities: "Diabetic",
            blood_type: "A+",
            emergency_contact_name: "Vanessa Casio",
            emergency_contact_number: "09987654321",
            address: "123 Rizal St, Brgy Antonio",
            city: "Caloocan",
            province: "MM",
            region: "NCR",
        },
    });

    const onSubmit: SubmitHandler<PatientFormValues> = async (data) => {
        try {
            console.log("Submitting data:", data);
            return data;
            // const response = await apiRequest<{ message: string }>(
            //     "/patients",
            //     {
            //         method: "POST",
            //         body: JSON.stringify(data),
            //     },
            // );
            // console.log(response.message);
            // Handle success
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    // 1. Watch the parent fields
    // eslint-disable-next-line react-hooks/incompatible-library
    const watchedRegion = form.watch("region"); // Add 'region' to your Zod schema
    const watchedProvince = form.watch("province");

    // 2. Memoize filtered lists for performance
    const availableProvinces = useMemo(() => {
        return watchedRegion
            ? addressUtils.getProvincesByRegion(watchedRegion)
            : [];
    }, [watchedRegion]);

    const availableCities = useMemo(() => {
        return watchedProvince
            ? addressUtils.getCitiesByProvince(watchedProvince)
            : [];
    }, [watchedProvince]);

    // 3. Reset children when a parent changes
    useEffect(() => {
        form.setValue("province", "");
        form.setValue("city", "");
    }, [watchedRegion, form]);

    useEffect(() => {
        form.setValue("city", "");
    }, [watchedProvince, form]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-4xl mx-auto "
            >
                <Card>
                    <CardContent className="space-y-4">
                        <div className="border-b pb-2">
                            <h3 className="text-lg font-medium">
                                Personal Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Enter the patient's legal identification
                                details.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div className="md:col-span-3">
                                {/* Patient ID Number */}
                                <FormField
                                    control={form.control}
                                    name="patient_id_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Patient ID Number{" "}
                                                <sup>(Auto Generated)</sup>
                                            </FormLabel>
                                            <FormControl>
                                                <Input disabled {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-3">
                                {/* Patient ID Number */}

                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled
                                            type="date"
                                            value={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </div>

                            <div className="md:col-span-2">
                                {/* First Name */}
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: Juan"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-1">
                                {/* Middle Name */}
                                <FormField
                                    control={form.control}
                                    name="middle_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Middle Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    onChange={(e) => {
                                                        const value = e.target
                                                            .value
                                                            ? e.target.value
                                                            : undefined;
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-2">
                                {/* Last Name */}
                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: Dela Cruz"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-1">
                                {/* Suffix */}
                                <FormField
                                    control={form.control}
                                    name="suffix"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Suffix</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Jr, Sr"
                                                    onChange={(e) => {
                                                        const value = e.target
                                                            .value
                                                            ? e.target.value
                                                            : undefined;
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="md:col-span-2">
                                {/* Date of Birth */}
                                <FormField
                                    control={form.control}
                                    name="date_of_birth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Date of Birth *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    // value={
                                                    //     field.value instanceof
                                                    //     Date
                                                    //         ? field.value
                                                    //               .toISOString()
                                                    //               .split("T")[0]
                                                    //         : field.value || ""
                                                    // }
                                                    // onChange={(e) =>
                                                    //     field.onChange(
                                                    //         new Date(
                                                    //             e.target.value,
                                                    //         ),
                                                    //     )
                                                    // }
                                                    // onBlur={field.onBlur}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="md:col-span-2">
                                {/* Sex */}
                                <FormField
                                    control={form.control}
                                    name="sex"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Sex *</FormLabel>
                                            <FormControl>
                                                <Select
                                                    name={field.name}
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <SelectTrigger
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        className="min-w-full"
                                                    >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        position="item-aligned"
                                                        className="w-full"
                                                    >
                                                        <SelectItem value="male">
                                                            Male
                                                        </SelectItem>
                                                        <SelectItem value="female">
                                                            Female
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-2">
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Ex: juan@example.com"
                                                    onChange={(e) => {
                                                        const value = e.target
                                                            .value
                                                            ? e.target.value
                                                            : undefined;
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-2">
                                {/* Contact Number */}
                                <FormField
                                    control={form.control}
                                    name="contact_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Contact Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: 09123456789"
                                                    onChange={(e) => {
                                                        const value = e.target
                                                            .value
                                                            ? e.target.value
                                                            : undefined;
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-2">
                                {/* Emergency Contact Name */}
                                <FormField
                                    control={form.control}
                                    name="emergency_contact_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Emergency Contact Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="optional"
                                                    onChange={(e) => {
                                                        const value = e.target
                                                            .value
                                                            ? e.target.value
                                                            : undefined;
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-2">
                                {/* Emergency Contact Number */}
                                <FormField
                                    control={form.control}
                                    name="emergency_contact_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Emergency Contact Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: 09123456789"
                                                    onChange={(e) => {
                                                        const value = e.target
                                                            .value
                                                            ? e.target.value
                                                            : undefined;
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="md:col-span-6">
                                {/* Address  */}
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Street Address / Barangay
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="123 Rizal St., Brgy. San Antonio"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-2">
                                {/* REGION DROPDOWN */}
                                <FormField
                                    control={form.control}
                                    name="region"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Region</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="min-w-full">
                                                        <SelectValue placeholder="Select Region" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {addressUtils
                                                        .getAllRegions()
                                                        .map((r) => (
                                                            <SelectItem
                                                                key={r.key}
                                                                value={r.key}
                                                            >
                                                                {r.long}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-2">
                                {/* PROVINCE DROPDOWN */}
                                <FormField
                                    control={form.control}
                                    name="province"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Province</FormLabel>
                                            <Select
                                                disabled={!watchedRegion}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="min-w-full">
                                                        <SelectValue placeholder="Select Province" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableProvinces.map(
                                                        (p) => (
                                                            <SelectItem
                                                                key={p.key}
                                                                value={p.key}
                                                            >
                                                                {p.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-2">
                                {/* CITY DROPDOWN */}
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                City / Municipality
                                            </FormLabel>
                                            <Select
                                                disabled={!watchedProvince}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="min-w-full">
                                                        <SelectValue placeholder="Select City" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableCities.map(
                                                        (c) => (
                                                            <SelectItem
                                                                key={c.name}
                                                                value={c.name}
                                                            >
                                                                {c.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="space-y-4 bg-slate-50 rounded-lg p-4">
                    <div className="border-b pb-2">
                        <h3 className="text-lg font-medium">
                            Additional Information
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Enter the patient's additional information.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 ">
                        <div className="md:col-span-2">
                            {/* Weight */}
                            <FormLabel className="mb-2">Weight</FormLabel>
                            <div className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    onChange={(e) => {
                                                        field.onChange(
                                                            parseInt(
                                                                e.target.value,
                                                                10,
                                                            ),
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="weight_unit"
                                    render={({ field }) => (
                                        <FormItem className="flex-none">
                                            <FormControl>
                                                <select
                                                    className="dark:bg-inherit"
                                                    tabIndex={-1}
                                                    {...field}
                                                >
                                                    {Object.keys(
                                                        weight_units,
                                                    ).map((w, i) => (
                                                        <option
                                                            key={i}
                                                            value={w}
                                                        >
                                                            ({w.toUpperCase()})
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            {/* Height */}
                            <FormLabel className="mb-2">Height</FormLabel>
                            <div className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    onChange={(e) => {
                                                        field.onChange(
                                                            parseInt(
                                                                e.target.value,
                                                                10,
                                                            ),
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="height_unit"
                                    render={({ field }) => (
                                        <FormItem className="flex-none">
                                            <FormControl>
                                                <select
                                                    className="dark:bg-inherit"
                                                    tabIndex={-1}
                                                    {...field}
                                                >
                                                    {Object.keys(
                                                        height_units,
                                                    ).map((u, i) => (
                                                        <option
                                                            key={i}
                                                            value={u}
                                                        >
                                                            ({u.toUpperCase()})
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            {/* Blood Type */}
                            <FormField
                                control={form.control}
                                name="blood_type"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Blood Type</FormLabel>
                                        <FormControl>
                                            <Select
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    className="min-w-full"
                                                >
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent
                                                    position="item-aligned"
                                                    className="w-full"
                                                >
                                                    {[
                                                        "A+",
                                                        "A-",
                                                        "B+",
                                                        "B-",
                                                        "AB+",
                                                        "AB-",
                                                        "O+",
                                                        "O-",
                                                    ].map((type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:col-span-3">
                            {/* Allergies */}
                            <FormField
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Allergies</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                rows={4}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                        ? e.target.value
                                                        : undefined;
                                                    field.onChange(value);
                                                }}
                                                placeholder="List any allergies"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:col-span-3">
                            {/* Comorbidities */}
                            <FormField
                                control={form.control}
                                name="comorbidities"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comorbidities</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                rows={4}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                        ? e.target.value
                                                        : undefined;
                                                    field.onChange(value);
                                                }}
                                                placeholder="List any comorbidities"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <Button type="submit">Create Patient</Button>
            </form>
            <FormDebugger form={form} />
        </Form>
    );
}
