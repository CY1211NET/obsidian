import { getSortedPostsData, getAllTags } from '@/lib/posts';
import Timeline from '@/components/ui/Timeline';

export default function TimelinePage() {
    const posts = getSortedPostsData();
    const tags = getAllTags();

    return (
        <main className="min-h-screen pt-24 pb-20">
            <Timeline posts={posts} tags={tags} />
        </main>
    );
}
