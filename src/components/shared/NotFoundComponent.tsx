import { PublicLayout } from "../layouts/PublicLayout";

export function NotFoundComponent() {
    return (
        <PublicLayout>
            <div className="wrapper flex flex-col justify-center items-center b-blue-1">
                <h1 className="text-2xl mb-4 font-extrabold">
                    404 – Page Not Found
                </h1>
                <p>The page you're looking for doesn't exist.</p>
            </div>
        </PublicLayout>
    );
}
