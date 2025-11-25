"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-2 rounded-md hover:bg-white/10 transition-colors">
                <div className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-neon-cyan relative group"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Moon className="w-5 h-5 transition-transform group-hover:rotate-12" />
            ) : (
                <Sun className="w-5 h-5 transition-transform group-hover:rotate-90" />
            )}
        </button>
    );
}
