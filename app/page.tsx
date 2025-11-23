import Hero from "@/components/ui/Hero";
import BlogList from "@/components/ui/BlogList";
import { getSortedPostsData, getAllTags } from "@/lib/posts";

export default function Home() {
  const posts = getSortedPostsData();
  const allTags = getAllTags();

  return (
    <div className="min-h-screen pb-20">
      <Hero />

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
