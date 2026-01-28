import { motion } from "framer-motion";

export default function PreloaderAlert({
    isLoading,
    src = "/loader/loader_2.gif",
    linearBg = true,
}: {
    isLoading: boolean;
    src?: string;
    linearBg?: boolean;
}) {
    return (
        <>
            {isLoading && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-50"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isLoading ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Linear Gradient Background */}
                    {linearBg && (
                        <div
                            className="bg-white/30 dark:bg-black/30 "
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    )}

                    {/* Animated Loading Container */}
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [0, -15, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        className="flex justify-center items-center p-8 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                        <img
                            src={src}
                            className="object-contain"
                            width={300}
                            height={300}
                            alt="Logo"
                        />
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
