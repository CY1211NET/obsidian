const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');
const publicDirectory = path.join(process.cwd(), 'public');

function getAllMarkdownFiles(dir, baseDir = dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...getAllMarkdownFiles(fullPath, baseDir));
        } else if (item.endsWith('.md')) {
            const relativePath = path.relative(baseDir, fullPath);
            files.push(relativePath);
        }
    }

    return files;
}

function generateSearchIndex() {
    console.log('Generating search index...');

    if (!fs.existsSync(postsDirectory)) {
        console.warn('Posts directory not found, skipping search index generation.');
        return;
    }

    const markdownFiles = getAllMarkdownFiles(postsDirectory);
    const posts = markdownFiles.map((relativePath) => {
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
            category: data.category || 'Uncategorized',
            tags: data.tags || [],
            excerpt: data.excerpt,
            content: content,
        };
    });

    // Sort by date desc
    posts.sort((a, b) => (a.date < b.date ? 1 : -1));

    const outputPath = path.join(publicDirectory, 'search.json');
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));

    console.log(`Search index generated with ${posts.length} posts at ${outputPath}`);
}

generateSearchIndex();
