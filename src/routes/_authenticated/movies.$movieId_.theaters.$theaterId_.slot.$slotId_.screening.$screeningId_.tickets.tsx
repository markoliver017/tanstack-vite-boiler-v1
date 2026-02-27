import { useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Plus } from "lucide-react";
import { NavHeader } from "@/components/layouts/NavHeader";
import { Button } from "@/components/shadcn-ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn-ui/dialog";
import { DataTable } from "@/components/shared/DataTable";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";

import { movieScreeningTimeByIdOptions } from "@/features/movie-screening-times/use-movie-screening-times";
import { checkerAssignmentByIdOptions } from "@/features/movie-checker-theater-assignments/use-checker-assignments";
import { culturalTaxesListOptions } from "@/features/cultural-taxes/use-cultural-taxes";
import { screeningTicketEntriesOptions } from "@/features/screening-ticket-entries/use-screening-ticket-entries";
import { getScreeningTicketEntriesColumns } from "@/features/screening-ticket-entries/screening-ticket-entries-columns";
import { CreateScreeningTicketEntryForm } from "@/features/screening-ticket-entries/CreateScreeningTicketEntryForm";
import type { ScreeningTicketEntryResponse } from "@/features/screening-ticket-entries/zScreeningTicketEntrySchema";

import { theaterMovieTicketPricesListOptions } from "@/features/theater-movie-ticket-prices/use-theater-movie-ticket-prices";
import { CreateTheaterMovieTicketPriceForm } from "@/features/theater-movie-ticket-prices/CreateTheaterMovieTicketPriceForm";
import { movieByIdOptions } from "@/features/movies/use-movies";
import { taxRuleOverridesListOptions } from "@/features/theater-production-tax-rules/use-tax-rule-overrides";
import { CreateTaxRuleOverrideForm } from "@/features/theater-production-tax-rules/CreateTaxRuleOverrideForm";
import { BulkCreateScreeningTicketEntryForm } from "@/features/screening-ticket-entries/BulkCreateScreeningTicketEntryForm";

export const Route = createFileRoute(
    "/_authenticated/movies/$movieId_/theaters/$theaterId_/slot/$slotId_/screening/$screeningId_/tickets",
)({
    params: {
        parse: (params) => ({
            movieId: z.number().int().parse(Number(params.movieId)),
            theaterId: z.number().int().parse(Number(params.theaterId)),
            slotId: z.number().int().parse(Number(params.slotId)),
            screeningId: z.number().int().parse(Number(params.screeningId)),
        }),
        stringify: ({ movieId, theaterId, slotId, screeningId }) => ({
            movieId: `${movieId}`,
            theaterId: `${theaterId}`,
            slotId: `${slotId}`,
            screeningId: `${screeningId}`,
        }),
    },
    validateSearch: z.object({
        page: z.number().catch(1),
        pageSize: z.number().catch(10),
        alert: z.string().optional(),
    }),
    loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
    loader: async ({
        context: { queryClient },
        params: { movieId, theaterId, slotId, screeningId },
        deps: { page, pageSize },
    }) => {
        const [slot, movie] = await Promise.all([
            queryClient.ensureQueryData(checkerAssignmentByIdOptions(slotId)),
            queryClient.ensureQueryData(movieByIdOptions(movieId)),
            queryClient.ensureQueryData(
                movieScreeningTimeByIdOptions(screeningId),
            ),
            queryClient.ensureQueryData(
                screeningTicketEntriesOptions(screeningId, page, pageSize),
            ),
            queryClient.ensureQueryData(
                theaterMovieTicketPricesListOptions(1, 1, theaterId, movieId),
            ),
        ]);

        if (slot?.theater?.city && slot?.theater?.province) {
            await queryClient.ensureQueryData(
                culturalTaxesListOptions(
                    1,
                    1,
                    undefined,
                    slot.theater.city,
                    slot.theater.province,
                ),
            );
        }

        if (movie?.productionCompanyId) {
            await queryClient.ensureQueryData(
                taxRuleOverridesListOptions(
                    1,
                    1,
                    theaterId,
                    movie.productionCompanyId,
                ),
            );
        }

        if (!slot.cinemaId || !slot.cinemaFormatId) {
            throw redirect({
                to: "/movies/$movieId/theaters/$theaterId/slot/$slotId",
                params: {
                    movieId: movieId,
                    theaterId: theaterId,
                    slotId: slotId,
                },
                search: {
                    alert: "missing_assignment_details",
                },
            });
        }
    },
    staticData: {
        title: "Screening Tickets",
        breadcrumb: "Tickets",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: ScreeningTicketsPage,
});

function ScreeningTicketsPage() {
    const { movieId, theaterId, slotId, screeningId } = Route.useParams();
    const { page, pageSize } = Route.useSearch();
    const navigate = Route.useNavigate();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<
        ScreeningTicketEntryResponse | undefined
    >(undefined);
    console.log("editingEntry");
    console.log(editingEntry);

    const { data: slot } = useQuery(checkerAssignmentByIdOptions(slotId));
    const { data: screening } = useQuery(
        movieScreeningTimeByIdOptions(screeningId),
    );
    const { data: ticketEntriesData, isFetching } = useQuery(
        screeningTicketEntriesOptions(screeningId, page, pageSize),
    );
    const { data: ticketPricesData } = useQuery(
        theaterMovieTicketPricesListOptions(1, 1, theaterId, movieId),
    );

    const { data: movie } = useQuery(movieByIdOptions(movieId));
    const productionCompanyId = movie?.productionCompanyId;
    const { data: taxRulesData } = useQuery({
        ...taxRuleOverridesListOptions(1, 1, theaterId, productionCompanyId),
        enabled: !!productionCompanyId,
    });

    const { data: culturalTaxesData } = useQuery({
        ...culturalTaxesListOptions(
            1,
            1,
            undefined,
            slot?.theater?.city,
            slot?.theater?.province || undefined,
        ),
        enabled: !!slot?.theater?.city && !!slot?.theater?.province,
    });

    const hasBasePrice = (ticketPricesData?.data?.length || 0) > 0;
    const hasTaxRule =
        !productionCompanyId || (taxRulesData?.data?.length || 0) > 0;

    const basePrice = Number(ticketPricesData?.data?.[0]?.basePrice || 0);
    const culturalTax = Number(
        culturalTaxesData?.data?.[0]?.deductionValue || 0,
    );
    const taxRate = Number(taxRulesData?.data?.[0]?.taxRule?.taxRate || 0);
    const taxDivisor = Number(taxRulesData?.data?.[0]?.taxRule?.divisor || 1);
    const taxFormulaType =
        taxRulesData?.data?.[0]?.taxRule?.formulaType || "ticket_based";

    const entries = ticketEntriesData?.data || [];
    const totalRecords = ticketEntriesData?.total || 0;
    const pageCount = Math.ceil(totalRecords / pageSize);

    const handleEdit = (entry: ScreeningTicketEntryResponse) => {
        setEditingEntry(entry);
        setIsDialogOpen(true);
    };

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setEditingEntry(undefined);
        }
    };

    const handleFormSuccess = () => {
        setIsDialogOpen(false);
        setEditingEntry(undefined);
    };

    const columns = getScreeningTicketEntriesColumns(handleEdit);

    const formatScreeningDate = () => {
        if (!screening) return "";
        let text = screening.dateStart;
        if (screening.dateEnd) text += ` to ${screening.dateEnd}`;
        return text;
    };

    return (
        <div className="space-y-6">
            <Dialog open={!hasBasePrice}>
                <DialogContent
                    id="base-price-modal"
                    className="sm:max-w-[425px]"
                    onPointerDownOutside={(e) => {
                        e.preventDefault();
                    }}
                    onEscapeKeyDown={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Setup Base Price</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground mb-4">
                        To manage tickets for this screening, a valid Base Price
                        must exist for this movie and theater.
                    </div>
                    {slot && (
                        <CreateTheaterMovieTicketPriceForm
                            defaultMovieId={movieId}
                            defaultTheaterId={theaterId}
                            lockMovieAndTheater={true}
                            onSuccess={() => {
                                // Dialog closes automatically on refetch
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={hasBasePrice && !hasTaxRule}>
                <DialogContent
                    id="tax-rule-modal"
                    className="sm:max-w-[425px]"
                    onPointerDownOutside={(e) => {
                        e.preventDefault();
                    }}
                    onEscapeKeyDown={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Setup Tax Rule</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground mb-4">
                        To manage tickets for this screening, a valid Tax Rule
                        must exist for this theater and the movie's production
                        company.
                    </div>
                    {slot && productionCompanyId && (
                        <CreateTaxRuleOverrideForm
                            defaultTheaterId={theaterId}
                            defaultProductionCompanyId={productionCompanyId}
                            lockTheaterAndCompany={true}
                            onSuccess={() => {
                                // Dialog closes automatically on refetch
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <NavHeader
                title="Screening Ticket Entries"
                description="Manage the breakdown of ticket sales per ticket class for this exact screening time."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Movie
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div
                            className="text-lg font-bold truncate"
                            title={slot?.movie?.title}
                        >
                            {slot?.movie?.title || "N/A"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Theater & Cinema
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div
                            className="text-lg font-bold truncate"
                            title={slot?.theater?.name}
                        >
                            {slot?.theater?.name || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {slot?.cinema?.name || "No Cinema Assigned"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Screening Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-lg font-bold">
                            {screening?.time || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {formatScreeningDate() || "No Schedule"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pricing Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-lg font-bold">
                            ₱ {basePrice.toFixed(2)} Base
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {taxFormulaType === "gross_based"
                                ? "Gross Overall"
                                : "Per Ticket"}{" "}
                            @ {(basePrice * (taxRate / taxDivisor)).toFixed(2)}x
                            Tax • ₱ {culturalTax.toFixed(2)} Fee
                        </div>
                    </CardContent>
                </Card>
            </div>

            {hasBasePrice && hasTaxRule && (
                <BulkCreateScreeningTicketEntryForm
                    screeningId={screeningId}
                    basePrice={basePrice}
                    culturalTax={culturalTax}
                    taxRate={taxRate}
                    taxDivisor={taxDivisor}
                    taxFormulaType={
                        taxFormulaType as "gross_based" | "ticket_based"
                    }
                />
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Ticket Type Sales</CardTitle>
                    <Dialog
                        open={isDialogOpen}
                        onOpenChange={handleDialogChange}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Entry
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            id="screening-ticket-entry-modal"
                            className="sm:max-w-[605px] max-h-[calc(100vh-10rem)] overflow-y-auto"
                        >
                            <DialogHeader>
                                <DialogTitle>
                                    {editingEntry
                                        ? "Edit Ticket Entry"
                                        : "Add Ticket Entry"}
                                </DialogTitle>
                            </DialogHeader>
                            <CreateScreeningTicketEntryForm
                                screeningId={screeningId}
                                basePrice={basePrice}
                                taxRate={taxRate}
                                taxDivisor={taxDivisor}
                                taxFormulaType={
                                    taxFormulaType as
                                        | "gross_based"
                                        | "ticket_based"
                                }
                                culturalTax={culturalTax}
                                initialData={editingEntry}
                                onSuccess={handleFormSuccess}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={entries}
                        pageCount={pageCount}
                        isLoading={isFetching}
                        onPaginationChange={(updater) => {
                            const nextState =
                                typeof updater === "function"
                                    ? updater({
                                          pageIndex: page - 1,
                                          pageSize,
                                      })
                                    : updater;
                            navigate({
                                search: {
                                    page: nextState.pageIndex + 1,
                                    pageSize: nextState.pageSize,
                                },
                            });
                        }}
                    />
                </CardContent>
            </Card>

            <Button variant="outline" asChild>
                <Link
                    to="/movies/$movieId/theaters/$theaterId/slot/$slotId"
                    params={{
                        movieId,
                        theaterId,
                        slotId,
                    }}
                >
                    Back to Slot Details
                </Link>
            </Button>
        </div>
    );
}
