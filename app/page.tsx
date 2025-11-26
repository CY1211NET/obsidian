import Hero from "@/components/ui/Hero";
import BlogList from "@/components/ui/BlogList";
import { getSortedPostsData, getAllTags } from "@/lib/posts";
import KnowledgeGraphWrapper from "@/components/ui/KnowledgeGraphWrapper";

export default function Home() {
  const posts = getSortedPostsData();
  const allTags = getAllTags();

  return (
    <div className="min-h-screen pb-20">
      <Hero />

      {/* Knowledge Graph Section */}
      <section className="relative z-10 -mt-20 mb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass-panel p-1 border border-neon-cyan/20 rounded-2xl overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded border border-neon-cyan/30 text-neon-cyan font-mono text-xs">
              KNOWLEDGE_GRAPH_VISUALIZER
            </div>
            <KnowledgeGraphWrapper posts={posts} />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-neon-purple" />
            LATEST_TRANSMISSIONS
          </h2>
          <div className="h-px flex-grow bg-white/10 ml-6" />
        </div>

        <BlogList posts={posts} allTags={allTags} />
      </section>
    </div>
  );
}
