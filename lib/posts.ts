import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
    slug: string;
    title: string;
    date: string;
    updatedAt?: string;
    category: string;
    tags: string[];
    excerpt?: string;
    readTime?: string;
    content: string;
}

export function getSortedPostsData(): PostData[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title || 'Untitled',
                date: data.date || new Date().toISOString().split('T')[0],
                updatedAt: data.updatedAt,
                category: data.category || 'Uncategorized',
                tags: data.tags || [],
                excerpt: data.excerpt,
                readTime: data.readTime,
                content,
            };
        });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getPostData(slug: string): PostData | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString().split('T')[0],
            updatedAt: data.updatedAt,
            category: data.category || 'Uncategorized',
            tags: data.tags || [],
            excerpt: data.excerpt,
            readTime: data.readTime,
            content,
        };
    } catch (error) {
        return null;
    }
}

export function getAllTags(): string[] {
    const posts = getSortedPostsData();
    const tags = new Set<string>();
    posts.forEach((post) => {
        post.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
}

// Get posts grouped by year and month for timeline
export function getPostsTimeline() {
    const posts = getSortedPostsData();
    const timeline: { [year: string]: { [month: string]: PostData[] } } = {};

    posts.forEach((post) => {
        const date = new Date(post.date);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        if (!timeline[year]) {
            timeline[year] = {};
        }
        if (!timeline[year][month]) {
            timeline[year][month] = [];
        }
        timeline[year][month].push(post);
    });

    return timeline;
}
