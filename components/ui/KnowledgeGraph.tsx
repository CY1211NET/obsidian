'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useTheme } from 'next-themes';
import PostListModal from './PostListModal';

interface Post {
    slug: string;
    title: string;
    date: string;
    category: string;
    tags: string[];
    excerpt?: string;
}

interface KnowledgeGraphProps {
    posts: Post[];
}

export default function KnowledgeGraph({ posts }: KnowledgeGraphProps) {
    const { theme } = useTheme();
    const fgRef = useRef<any>();
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 600 });

    // Handle window resize
    useEffect(() => {
        const updateDimensions = () => {
            const container = document.getElementById('knowledge-graph-container');
            if (container) {
                setGraphDimensions({
                    width: container.clientWidth,
                    height: container.clientHeight
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        // Initial delay to ensure container is rendered
        setTimeout(updateDimensions, 100);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const graphData = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];
        const categories = new Set<string>();
        const tags = new Set<string>();

        // 1. Extract Categories and Tags
        posts.forEach(post => {
            categories.add(post.category);
            post.tags.forEach(tag => tags.add(tag));
        });

        // 2. Create Category Nodes (Group 1)
        categories.forEach(cat => {
            nodes.push({
                id: `cat-${cat}`,
                name: cat,
                group: 1, // Category
                val: 20, // Size
                color: '#bc13fe' // Neon Purple
            });
        });

        // 3. Create Tag Nodes (Group 2)
        tags.forEach(tag => {
            nodes.push({
                id: `tag-${tag}`,
                name: tag,
                group: 2, // Tag
                val: 10, // Size
                color: '#00f3ff' // Neon Cyan
            });
        });

        // 4. Create Links
        posts.forEach(post => {
            const catId = `cat-${post.category}`;
            post.tags.forEach(tag => {
                const tagId = `tag-${tag}`;
                // Link Category <-> Tag
                // Check if link already exists to avoid duplicates (undirected)
                const linkId = `${catId}-${tagId}`;

                if (!links.find(l => (l.source === catId && l.target === tagId) || (l.source === tagId && l.target === catId))) {
                    links.push({
                        source: catId,
                        target: tagId,
                        color: 'rgba(255,255,255,0.2)'
                    });
                }
            });
        });

        return { nodes, links };
    }, [posts]);

    const handleNodeClick = (node: any) => {
        setSelectedNode(node);
        setIsModalOpen(true);

        // Center view on node
        if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 1000);
            fgRef.current.zoom(2, 2000);
        }
    };

    const getFilteredPosts = () => {
        if (!selectedNode) return [];
        const name = selectedNode.name;
        if (selectedNode.group === 1) {
            // Category
            return posts.filter(p => p.category === name);
        } else {
            // Tag
            return posts.filter(p => p.tags.includes(name));
        }
    };

    if (posts.length === 0) {
        return (
            <div className="w-full h-[500px] flex items-center justify-center text-gray-500 font-mono">
                No data available for the Knowledge Graph.
            </div>
        );
    }

    return (
        <div id="knowledge-graph-container" className="w-full h-[500px] relative bg-black/20 border border-neon-cyan/20 rounded-xl overflow-hidden">
            <div className="absolute top-4 left-4 text-neon-cyan/50 text-xs font-mono z-50 pointer-events-none">
                INTERACTIVE_NEURAL_NET // DRAG_TO_MOVE // SCROLL_TO_ZOOM
            </div>
            <ForceGraph2D
                ref={fgRef}
                width={graphDimensions.width}
                height={graphDimensions.height}
                graphData={graphData}

                // Node Styling
                nodeLabel="name"
                nodeColor="color"
                nodeVal="val"
                nodeRelSize={4}

                // Link Styling
                linkColor={() => 'rgba(255,255,255,0.1)'}
                linkWidth={1}

                // Canvas Styling
                backgroundColor="rgba(0,0,0,0)"

                // Interaction
                onNodeClick={handleNodeClick}
                enableNodeDrag={true}
                enableZoomInteraction={true}

                // Forces (Obsidian-like physics)
                d3VelocityDecay={0.1} // Low friction for drift
                d3AlphaDecay={0.02} // Slow stabilization

                // Particles (Data flow effect)
                linkDirectionalParticles={2}
                linkDirectionalParticleWidth={2}
                linkDirectionalParticleSpeed={0.005}
                linkDirectionalParticleColor={() => '#ffffff'}
            />

            <PostListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedNode ? `${selectedNode.group === 1 ? 'Category' : 'Tag'}: ${selectedNode.name}` : ''}
                posts={getFilteredPosts()}
            />
        </div>
    );
}
