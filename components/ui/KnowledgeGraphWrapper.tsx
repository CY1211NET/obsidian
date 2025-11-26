'use client';

import dynamic from 'next/dynamic';

const KnowledgeGraph = dynamic(() => import('./KnowledgeGraph'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] flex items-center justify-center text-neon-cyan font-mono animate-pulse">
            Loading Neural Network...
        </div>
    )
});

export default function KnowledgeGraphWrapper(props: any) {
    return <KnowledgeGraph {...props} />;
}
