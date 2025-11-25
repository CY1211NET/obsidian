'use client';

import { useState, HTMLAttributes } from 'react';
import { ChevronDown, ChevronRight, Table as TableIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleTableProps extends HTMLAttributes<HTMLTableElement> {
    children?: React.ReactNode;
    node?: any;
}

export default function CollapsibleTable({ children, ...props }: CollapsibleTableProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="my-8 border border-neon-cyan/20 rounded-lg overflow-hidden bg-[#1e1e1e]">
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-2 bg-neon-cyan/5 border-b border-neon-cyan/10 cursor-pointer hover:bg-neon-cyan/10 transition-colors"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan">
                    <TableIcon className="w-4 h-4" />
                    <span>DATA_TABLE</span>
                </div>

                <div className="text-neon-cyan/70">
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            {/* Content */}
            <AnimatePresence initial={false}>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="!my-0 w-full" {...props}>
                                {children}
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
