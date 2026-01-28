const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || "An error occurred while fetching",
        );
    }

    return response.json();
}
