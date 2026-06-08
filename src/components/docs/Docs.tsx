import { motion } from 'framer-motion';
import type React from 'react';

export const ConfigOption = ({ name, type, def, children }: { name: string, type: string, def: string, children: React.ReactNode }) => (
    <div className="!my-8 !border !border-gray-800 !rounded-lg !bg-[#050505] overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="!bg-[#111] !px-4 !py-3 !border-b !border-gray-800 flex justify-between items-center flex-wrap gap-2">
            <code className="!text-[#ff2929] !bg-transparent !p-0 !text-base font-bold tracking-wide">{name}</code>
            <div className="flex gap-4 text-xs font-mono">
                <span className="text-gray-400">Type: <span className="text-mc-b !font-extralight !font-minecraft">{type}</span></span>
                <span className="text-gray-400">Default: <span className="text-mc-a !font-extralight !font-minecraft">{def}</span></span>
            </div>
        </div>
        <div className="!p-4 text-gray-300 text-sm leading-relaxed prose-p:!my-2">
            {children}
        </div>
    </div>
);

export const TipBox = ({ title, children, type = "info" }: { title: string, children: React.ReactNode, type?: "info" | "warning" }) => {
    const isWarning = type === "warning";
    return (
        <div className={`!my-6 !p-4 !rounded-lg !border-l-4 !rounded-r-lg !bg-gray-900/30 ${isWarning ? '!border-mc-c' : '!border-mc-a'}`}>
            <h4 className={`!m-0 !mb-2 !text-sm !font-bold uppercase tracking-wider ${isWarning ? '!text-mc-c' : '!text-mc-a'}`}>
                {title}
            </h4>
            <div className="!m-0 !text-gray-300 !text-sm">
                {children}
            </div>
        </div>
    );
};

export const TextLink = ({ className, href, inNewTab = false, children }: { className?: string, href: string, inNewTab?: boolean, children: React.ReactNode }) => {
    return (
        <motion.a 
                href={href}
                className={`text-[#ff2929] hover:text-[#ff5555] ml-1 font-bold no-underline transition-color cursor-pointers inline-block ${className}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                target={inNewTab ? '_blank' : '_self'}
            >
                {children}
        </motion.a>
    )
};