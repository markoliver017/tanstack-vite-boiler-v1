"use client";

import type { ReactNode } from "react";

import { motion, type Variants } from "framer-motion";

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

const variants: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.55, ease: "easeOut" },
    },
};

export default function Reveal({ children, className, delay }: RevealProps) {
    return (
        <motion.div
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={delay ? { delay } : undefined}
        >
            {children}
        </motion.div>
    );
}
