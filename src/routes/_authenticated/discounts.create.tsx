import BackButton from "@/components/shared/BackButton";
import { CreateDiscountForm } from "@/features/discounts/CreateDiscountForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/discounts/create")({
    staticData: {
        title: "Create Discount",
        breadcrumb: "Create Discount",
    },
    component: CreateDiscountPage,
});

function CreateDiscountPage() {
    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateDiscountForm />
        </div>
    );
}
