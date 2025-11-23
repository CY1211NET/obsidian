import { getPostsTimeline } from '@/lib/posts';
import Timeline from '@/components/ui/Timeline';

export default function TimelinePage() {
    const timeline = getPostsTimeline();

    return (
        <main className="min-h-screen pt-24 pb-20">
            <Timeline timeline={timeline} />
        </main>
    );
}
