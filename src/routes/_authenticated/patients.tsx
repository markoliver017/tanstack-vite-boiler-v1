// import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { CreatePatientForm } from "@/features/patients/CreatePatientForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/patients")({
    staticData: {
        title: "Patients",
        breadcrumb: "List of Patients",
    },
    // loader: async () => {
    //     throw { message: "Something went wrong" };
    // },
    // errorComponent: ({ error }) => {
    //     return <PageErrorComponent error={error} />;
    // },
    component: CreatePatientForm,
});
