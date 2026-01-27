import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserApi } from "./services";

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUserApi,
        onSuccess: () => {
            // Invalidate the users list so it refetches automatically
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
