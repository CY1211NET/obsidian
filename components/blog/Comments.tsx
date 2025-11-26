"use client";

import { useEffect, useRef } from "react";
import { init } from "@waline/client";
import "@waline/client/style";
import { useTheme } from "next-themes";

interface CommentsProps {
    path: string;
}

export default function Comments({ path }: CommentsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (!containerRef.current) return;

        const walineInstance = init({
            el: containerRef.current,
            serverURL: "http://47.114.103.174:8360",
            path: path,
            dark: 'html.dark', // Auto dark mode support based on html class
            // @ts-ignore
            placeholder: "请文明发言哟 ヾ(≧▽≦*)o",
            sofa: "快来发表你的意见吧 (≧∀≦)ゞ",
            emoji: false,
            imageUploader: false, // Corrected from imgUploader based on Waline docs usually being imageUploader or similar, checking docs if possible but sticking to standard config
            wordLimit: 200,
            requiredMeta: [],
            reaction: true,
            reactionText: ["点赞", "踩一下", "得意", "不屑", "尴尬", "睡觉"],
            reactionTitle: "你认为这篇文章怎么样？",
        });

        return () => {
            if (walineInstance) {
                try {
                    walineInstance.destroy();
                } catch (e) {
                    // Ignore AbortError which can happen if cleanup runs while requests are pending
                    console.warn('Waline destroy error:', e);
                }
            }
        };
    }, [path]);

    return (
        <div className="mt-16 pt-10 border-t border-white/10">
            <div className="flex items-center gap-2 mb-8">
                <span className="text-neon-cyan font-mono text-lg"># COMMENTS</span>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-neon-cyan/50 to-transparent" />
            </div>
            <div ref={containerRef} className="waline-container" />
        </div>
    );
}
