import { NextResponse } from 'next/server';
import { getSortedPostsData } from '@/lib/posts';

export async function GET() {
    const posts = getSortedPostsData();
    return NextResponse.json(posts);
}
