import { useRef, useState } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcn-ui/avatar";
import { Button } from "@/components/shadcn-ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useUploadAvatar } from "./mutations";
import Swal from "sweetalert2";

interface AvatarUploadProps {
    userId: string;
    currentImage?: string | null;
    userName: string;
}

export function AvatarUpload({
    userId,
    currentImage,
    userName,
}: AvatarUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const uploadMutation = useUploadAvatar();

    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith("image/")) {
            Swal.fire({
                title: "Invalid File",
                text: "Please select an image file (JPG, PNG, GIF, etc.)",
                icon: "error",
            });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                title: "File Too Large",
                text: "Image must be less than 5MB",
                icon: "error",
            });
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        // Upload
        uploadMutation.mutate(
            { userId, file },
            {
                onSuccess: () => {
                    Swal.fire({
                        title: "Avatar Updated",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                },
                onError: (err) => {
                    setPreview(null);
                    Swal.fire({
                        title: "Upload Failed",
                        text: err.message,
                        icon: "error",
                    });
                },
            },
        );
    };

    const displayImage = preview || currentImage;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-muted">
                    <AvatarImage
                        src={displayImage || undefined}
                        alt={userName}
                    />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                    {uploadMutation.isPending ? (
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                    ) : (
                        <Camera className="h-8 w-8 text-white" />
                    )}
                </button>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
            >
                {uploadMutation.isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <Camera className="mr-2 h-4 w-4" />
                        Change Photo
                    </>
                )}
            </Button>
        </div>
    );
}
