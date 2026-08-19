import { r2ListAllObjects } from '@/lib/r2-edge';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const bucket = process.env.R2_BUCKET_NAME;
    if (!bucket) {
      return NextResponse.json({ error: 'Bucket not configured' }, { status: 500 });
    }

    const allObjects = await r2ListAllObjects();

    const files = allObjects.map(obj => {
      const ext = obj.Key?.split('.').pop()?.toLowerCase();
      let type = 'Document';
      if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
        type = 'Image';
      }
      return {
        id: obj.Key,
        name: obj.Key,
        type,
        size: obj.Size || 0,
        url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${obj.Key.split('/').map(encodeURIComponent).join('/')}`,
        created_at: obj.LastModified,
      };
    });

    files.sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return NextResponse.json(files);
  } catch (error: any) {
    console.error('Failed to list files:', error);
    return NextResponse.json({ error: 'Failed to list files', details: error.message, stack: error.stack }, { status: 500 });
  }
}
