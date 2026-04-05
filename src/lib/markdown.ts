import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Polyfill Buffer for gray-matter in browser
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

export interface PostMetadata {
  title: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  draft: boolean;
  author: string;
  [key: string]: any;
}

export const parseMarkdown = (content: string) => {
  if (typeof content !== 'string') {
    console.error('Expected string for markdown content, but received:', typeof content, content);
    return {
      metadata: null,
      content: ''
    };
  }
  
  if (!content.trim()) {
    return {
      metadata: null,
      content: ''
    };
  }

  try {
    const { data, content: body } = matter(content);
    
    // Ensure dates are strings to avoid React rendering errors
    const sanitizedData = { ...data };
    Object.keys(sanitizedData).forEach(key => {
      if (sanitizedData[key] instanceof Date) {
        sanitizedData[key] = sanitizedData[key].toISOString().split('T')[0];
      }
    });

    return {
      metadata: sanitizedData as PostMetadata,
      content: body || ''
    };
  } catch (e) {
    console.error('Error parsing frontmatter:', e);
    return {
      metadata: null,
      content: content
    };
  }
};
