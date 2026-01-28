import { Link, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "../shadcn-ui/button";
export default function PageErrorSearchComponent({
    error,
}: ErrorComponentProps) {
    if (
        error instanceof Error &&
        (error.message.includes("invalid_type") ||
            error.message.includes("invalid_format"))
    ) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-center">
                <h2 className="text-red-700 font-bold">Invalid Link</h2>
                <p className="text-red-600">
                    The verification email address is missing or invalid.
                </p>
                <pre className="mt-2 text-xs text-red-400">
                    {/* Optional: Mapping through specific Zod issues if needed */}
                    Please check the URL and try again.
                </pre>
                <Button asChild variant="outline" className="mt-4">
                    <Link to="/">Go Back</Link>
                </Button>
            </div>
        );
    }
    return <div>Something went wrong: {error.message}</div>;
}
