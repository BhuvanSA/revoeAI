"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition = {
    type: "spring",
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
};

export const MenuItem = ({
    setActive,
    active,
    item,
    children,
}: {
    setActive: (item: string) => void;
    active: string | null;
    item: any;
    children?: React.ReactNode;
}) => {
    return (
        <div
            onMouseEnter={() => setActive(item)}
            className="relative flex items-center"
        >
            <motion.p
                transition={{ duration: 0.3 }}
                className="cursor-pointer hover:opacity-[0.9] m-0 p-0"
            >
                {item}
            </motion.p>
            {active !== null && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={transition}
                >
                    {active === item && (
                        <div
                            className="fixed z-50"
                            style={{
                                top: "calc(var(--menu-height) + 1000px)",
                                left: "0%",
                                transform: "translateX(-100%)",
                            }}
                        >
                            <motion.div
                                transition={transition}
                                layoutId="active"
                                className="bg-background backdrop-blur-sm rounded-2xl overflow-hidden border border-border shadow-xl mx-auto"
                            >
                                <motion.div layout className="w-max h-full p-4">
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export const Menu = ({
    setActive,
    children,
}: {
    setActive: (item: string | null) => void;
    children: React.ReactNode;
}) => {
    return (
        <nav
            onMouseLeave={() => setActive(null)}
            className="relative rounded-full border border-border bg-background shadow-input flex items-center justify-center space-x-4 px-8 py-4"
            style={{ "--menu-height": "60px" } as React.CSSProperties}
        >
            {children}
        </nav>
    );
};

export const ProductItem = ({
    title,
    description,
    href,
    src,
}: {
    title: string;
    description: string;
    href: string;
    src: string;
}) => {
    return (
        <Link href={href} className="flex space-x-2 max-w-[300px]">
            <Image
                src={src}
                width={80}
                height={45}
                alt={title}
                className="shrink-0 rounded-md shadow-2xl"
            />
            <div>
                <h4 className="text-xl font-bold mb-1 text-primary">{title}</h4>
                <p className="text-muted-foreground text-sm max-w-[10rem]">
                    {description}
                </p>
            </div>
        </Link>
    );
};

export const HoveredLink = ({ children, ...rest }: any) => {
    return (
        <Link className="text-muted-foreground hover:text-foreground" {...rest}>
            {children}
        </Link>
    );
};
