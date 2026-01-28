import { queryOptions } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { User } from "better-auth";

export const userByEmailOptions = (email: string) =>
    queryOptions({
        // The key must include the email so Query knows to cache different users separately
        queryKey: ["users", email],
        // Pass the email into your apiRequest template string
        queryFn: () => apiRequest<User>(`/users/email/${email}`),
    });
