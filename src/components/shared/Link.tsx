import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function Link({ href, children, isExternal = false, isMobile = false }: { href: string, children: React.ReactNode, isExternal?: boolean, isMobile?: boolean }) {
  return (
    <motion.a
        href={href}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        target={isExternal ? '_blank' : '_self'}
        className={`group flex gap-1 text-gray-200 hover:text-white transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}
    >
        {children}
        {isExternal && <ArrowUpRight size={isMobile ? 10 : 12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />}
    </motion.a>
  );
}