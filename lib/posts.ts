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

/**
 * Recursively get all markdown files from a directory
 * @param dir - Directory to search
 * @param baseDir - Base directory for calculating relative paths
 * @returns Array of relative file paths
 */
function getAllMarkdownFiles(dir: string, baseDir: string = dir): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively search subdirectories
            files.push(...getAllMarkdownFiles(fullPath, baseDir));
        } else if (item.endsWith('.md')) {
            // Get relative path from base directory
            const relativePath = path.relative(baseDir, fullPath);
            files.push(relativePath);
        }
    }

    return files;
}

/**
 * Calculate read time based on word count (approx. 200 words per minute)
 * @param content - Markdown content
 * @returns Read time string (e.g., "5 MIN READ")
 */
function calculateReadTime(content: string): string {
    const words = content.trim().split(/\s+/).length;
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const totalCount = words + chineseChars;
    const minutes = Math.ceil(totalCount / 200);
    return `${minutes} MIN READ`;
}

export function getSortedPostsData(): PostData[] {
    const markdownFiles = getAllMarkdownFiles(postsDirectory);
    const allPostsData = markdownFiles.map((relativePath) => {
        // Convert file path to slug (remove .md extension and normalize path separators)
        const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
        const fullPath = path.join(postsDirectory, relativePath);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        let dateStr = new Date().toISOString().split('T')[0];
        if (data.date) {
            if (data.date instanceof Date) {
                dateStr = data.date.toISOString().split('T')[0];
            } else {
                dateStr = String(data.date);
            }
        }

        return {
            slug,
            title: data.title || 'Untitled',
            date: dateStr,
            updatedAt: data.updatedAt,
            category: data.category || 'Uncategorized',
            tags: data.tags || [],
            excerpt: data.excerpt,
            readTime: calculateReadTime(content), // Auto-calculate read time
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
        // Normalize slug to use system path separator
        const normalizedSlug = slug.replace(/\//g, path.sep);
        const fullPath = path.join(postsDirectory, `${normalizedSlug}.md`);

        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        let dateStr = new Date().toISOString().split('T')[0];
        if (data.date) {
            if (data.date instanceof Date) {
                dateStr = data.date.toISOString().split('T')[0];
            } else {
                dateStr = String(data.date);
            }
        }

        return {
            slug,
            title: data.title || 'Untitled',
            date: dateStr,
            updatedAt: data.updatedAt,
            category: data.category || 'Uncategorized',
            tags: data.tags || [],
            excerpt: data.excerpt,
            readTime: calculateReadTime(content), // Auto-calculate read time
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

export function getAllCategories(): string[] {
    const posts = getSortedPostsData();
    const categories = new Set<string>();
    posts.forEach((post) => {
        if (post.category) categories.add(post.category);
    });
    return Array.from(categories);
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
