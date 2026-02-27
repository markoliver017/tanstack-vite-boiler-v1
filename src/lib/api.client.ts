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
        let errorMessage =
            response.statusText || "An error occurred while fetching";
        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMessage = Array.isArray(errorData.message)
                    ? errorData.message.join(", ")
                    : errorData.message;
            } else if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch {
            // Ignore error if response is not JSON
        }
        throw new Error(errorMessage);
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
        let errorMessage =
            response.statusText || "An error occurred while fetching";
        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMessage = Array.isArray(errorData.message)
                    ? errorData.message.join(", ")
                    : errorData.message;
            } else if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch {
            // Ignore error if response is not JSON
        }
        throw new Error(errorMessage);
    }

    const total = Number(response.headers.get("X-Total-Count") || 0);
    const data = await response.json();

    return { data, total };
}
