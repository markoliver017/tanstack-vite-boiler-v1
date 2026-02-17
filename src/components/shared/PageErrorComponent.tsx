import BackButton from "./BackButton";

export default function PageErrorComponent({ error }: { error: Error }) {
    return (
        <div className="max-w-md mx-auto text-center">
            <div className="bg-yellow-50 p-4">
                <h3 className="font-bold">ERROR</h3>
                <div>
                    We couldn't load your data right now.{" "}
                    <pre>
                        Error Message: {error.message || "Something went wrong"}
                    </pre>
                </div>
                <BackButton />
            </div>
        </div>
    );
}
