import { r2ListAllObjects, r2CopyObject, r2DeleteObject } from '@/lib/r2-edge';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { oldKey, newKey, isFolder } = await request.json();
    const bucket = process.env.R2_BUCKET_NAME;

    if (!bucket || !oldKey || !newKey) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (isFolder) {
      const allObjects = await r2ListAllObjects(`${oldKey}/`);
      for (const obj of allObjects) {
        const newObjKey = obj.Key.replace(`${oldKey}/`, `${newKey}/`);
        await r2CopyObject(obj.Key, newObjKey);
        await r2DeleteObject(obj.Key);
      }
    } else {
      await r2CopyObject(oldKey, newKey);
      await r2DeleteObject(oldKey);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to rename:', error);
    return NextResponse.json({ error: 'Failed to rename' }, { status: 500 });
  }
}
