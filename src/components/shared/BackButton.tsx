import { Button } from "../shadcn-ui/button";
import { useRouter } from "@tanstack/react-router";

export default function BackButton() {
    const router = useRouter();

    return (
        <Button
            variant="outline"
            onClick={() => router.history.back()}
            className="mb-1"
        >
            ← <span className="hidden md:inline">Back</span>
        </Button>
    );
}
