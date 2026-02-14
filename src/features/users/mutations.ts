import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import { authClient } from "@/lib/auth/auth-client";
import type { CreateUserValues } from "./zUsersSchema";

// ==========================================
//  CREATE USER
// ==========================================

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateUserValues) => {
            return apiRequest("/users", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

// ==========================================
//  UPDATE USER
// ==========================================

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<CreateUserValues>;
        }) => {
            return apiRequest(`/users/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

// ==========================================
//  DELETE USER
// ==========================================

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return apiRequest(`/users/${id}`, { method: "DELETE" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

// ==========================================
//  BAN / UNBAN (better-auth admin plugin)
// ==========================================

export function useBanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            userId,
            banReason,
            banExpiresIn,
        }: {
            userId: string;
            banReason?: string;
            banExpiresIn?: number;
        }) => {
            const { error } = await authClient.admin.banUser({
                userId,
                banReason,
                banExpiresIn,
            });
            if (error) throw error;
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

export function useUnbanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const { error } = await authClient.admin.unbanUser({ userId });
            if (error) throw error;
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

// ==========================================
//  SET USER ROLE (better-auth admin plugin)
// ==========================================

export function useSetUserRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            userId,
            role,
        }: {
            userId: string;
            role: string;
        }) => {
            const { error } = await authClient.admin.setRole({
                userId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                role: role as any,
            });
            if (error) throw error;
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

// ==========================================
//  CHANGE PASSWORD (self - current user)
// ==========================================

export function useChangePassword() {
    return useMutation({
        mutationFn: async ({
            currentPassword,
            newPassword,
        }: {
            currentPassword: string;
            newPassword: string;
        }) => {
            const { error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: false,
            });
            if (error) throw error;
            return true;
        },
    });
}

// ==========================================
//  ADMIN SET PASSWORD (for other users)
// ==========================================

export function useAdminSetPassword() {
    return useMutation({
        mutationFn: async ({
            userId,
            newPassword,
        }: {
            userId: string;
            newPassword: string;
        }) => {
            const { error } = await authClient.admin.updateUser({
                userId,
                data: { password: newPassword },
            });
            if (error) throw error;
            return true;
        },
    });
}

// ==========================================
//  AVATAR UPLOAD (via assets-server)
// ==========================================

const ASSETS_SERVER_URL =
    import.meta.env.VITE_ASSETS_SERVER_URL || "http://localhost:3040";

export function useUploadAvatar() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            userId,
            file,
        }: {
            userId: string;
            file: File;
        }) => {
            // 1. Upload file to assets-server
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "file_upload");
            formData.append("domain", "anes-site");

            const uploadRes = await fetch(`${ASSETS_SERVER_URL}/api/uploads`, {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                throw new Error("Failed to upload image");
            }

            const uploadData = await uploadRes.json();
            const imageUrl = uploadData.file_data?.url;

            if (!imageUrl) throw new Error("No image URL returned");

            // 2. Save URL to user record
            return apiRequest(`/users/${userId}`, {
                method: "PATCH",
                body: JSON.stringify({ image: imageUrl }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

// ==========================================
//  GOOGLE ACCOUNT LINKING
// ==========================================

export function useLinkGoogle() {
    return useMutation({
        mutationFn: async ({ callbackURL }: { callbackURL?: string }) => {
            const { error } = await authClient.linkSocial({
                provider: "google",
                callbackURL: callbackURL || window.location.href,
            });
            if (error) throw error;
            return true;
        },
    });
}

export function useUnlinkGoogle() {
    return useMutation({
        mutationFn: async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (authClient as any).unlinkAccount({
                providerId: "google",
            });
            if (error) throw error;
            return true;
        },
    });
}

// ==========================================
//  MANUAL EMAIL VERIFICATION
// ==========================================

export function useVerifyUserEmail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const { error } = await authClient.admin.updateUser({
                userId,
                data: { emailVerified: true },
            });
            if (error) throw error;
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
