const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include", // use in nestjs api calls
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "An unknown error occurred while fetching",
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // If the response body is not JSON or doesn't contain a message,
            // use the HTTP status text as a fallback.
            throw new Error(
                response.statusText || "An error occurred while fetching",
            );
        }
    }

    return response.json();
}

export async function fetchList<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<{ data: T; total: number }> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include", // use in nestjs api calls
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(
            response.statusText || "An error occurred while fetching",
        );
    }

    const total = Number(response.headers.get("X-Total-Count") || 0);
    const data = await response.json();

    return { data, total };
}
