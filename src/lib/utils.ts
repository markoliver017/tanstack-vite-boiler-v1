import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function wait() {
    const delay = 1000;
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export const isRouteActive = (currentPath: string, navPath: string) => {
    // 1. Exact match (Home/Dashboard usually requires this)
    if (currentPath === navPath) return true;

    // 2. Dynamic match: currentPath starts with navPath + "/"
    // Example: current: /dashboard/admin/event/1, nav: /dashboard/admin/event
    // We add the "/" to avoid matching /events-logs against /events
    return currentPath.startsWith(`${navPath}/`);
};

export const getInitials = (fullName: string): string => {
    return fullName
        .split(" ")
        .map((name) => name[0])
        .join("");
};

export const getBaseUrl = () => {
    return import.meta.env.VITE_APP_URL || "http://localhost:3000";
};

export const getCallbackUrl = (redirect?: string) => {
    const baseUrl = getBaseUrl();
    return redirect ? `${baseUrl}${redirect}` : `${baseUrl}/dashboard`;
};
