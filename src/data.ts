import { parseMarkdown } from './lib/markdown';

// --- Types ---

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  updated?: string;
  readingTime: string;
  category: string;
  tags: string[];
  author: string;
  draft?: boolean;
}

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  type: 'learning' | 'project' | 'milestone' | 'article';
}

// --- Dynamic Post Loading ---

// Import all markdown files from the post directory
const markdownFiles = import.meta.glob('/post/**/*.md', { query: '?raw', import: 'default', eager: true });

const dynamicPosts: Post[] = Object.entries(markdownFiles).map(([path, rawContent]) => {
  // Extract ID from path (e.g., /post/linux/DNS.md -> linux-dns)
  const id = path
    .replace('/post/', '')
    .replace('.md', '')
    .replace(/\//g, '-')
    .toLowerCase();

  const { metadata } = parseMarkdown(rawContent as string);

  // Basic excerpt generation
  const excerpt = (rawContent as string)
    .replace(/---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/[#*`]/g, '') // Remove markdown symbols
    .trim()
    .slice(0, 160) + '...';

  // Reading time calculation (rough estimate)
  const wordsPerMinute = 200;
  const wordCount = (rawContent as string).split(/\s+/).length;
  const readingTime = `${Math.ceil(wordCount / wordsPerMinute)} min read`;

  const formatDate = (date: any) => {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return typeof date === 'string' ? date : String(date);
  };

  return {
    id,
    title: metadata?.title || id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    excerpt: metadata?.excerpt || excerpt,
    content: rawContent as string,
    date: formatDate(metadata?.date || '2024-01-01'),
    updated: metadata?.updated ? formatDate(metadata.updated) : undefined,
    readingTime,
    category: metadata?.category || path.split('/')[2] || 'General',
    tags: metadata?.tags || [],
    author: metadata?.author || 'Admin',
    draft: metadata?.draft || false
  };
});

export const posts: Post[] = dynamicPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// --- Timeline Data ---

export const timeline: TimelineEntry[] = [];
