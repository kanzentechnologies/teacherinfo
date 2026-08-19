import { r2ListAllObjects, r2DeleteObject } from '@/lib/r2-edge';
import { NextResponse } from 'next/server';
import { getPages, savePage } from '@/lib/pageStore';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { keys = [], folders = [] } = await request.json();
    const bucket = process.env.R2_BUCKET_NAME;

    if (!bucket) {
      return NextResponse.json({ error: 'Bucket not configured' }, { status: 500 });
    }

    // 1. Delete individual files
    for (const key of keys) {
      await r2DeleteObject(key);
    }

    // 2. Delete folders (all files with that prefix)
    for (const folder of folders) {
      const allObjects = await r2ListAllObjects(`${folder}/`);
      for (const obj of allObjects) {
        await r2DeleteObject(obj.Key);
      }
    }

    // 3. Cascading delete to Pages
    try {
      const pages = await getPages();
      const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

      for (const page of pages) {
        if (page.layout === 'links' && page.content) {
          try {
            let links = JSON.parse(page.content);
            let modified = false;

            const processTree = (nodes: any[]): any[] => {
              return nodes.filter(node => {
                if (node.type !== 'folder') {
                  const url = node.url || '';
                  const isDeletedKey = keys.some((k: string) => {
                    const encodedKey = k.split('/').map(encodeURIComponent).join('/');
                    return url === `${r2Url}/${encodedKey}` || url.endsWith(`/${encodedKey}`);
                  });
                  const isDeletedFolder = folders.some((f: string) => {
                    const encodedFolder = f.split('/').map(encodeURIComponent).join('/');
                    return url.includes(`/${encodedFolder}/`);
                  });
                  if (isDeletedKey || isDeletedFolder) {
                    modified = true;
                    return false;
                  }
                } else {
                  const isDeletedFolder = folders.some((f: string) => f === node.title || f.endsWith(`/${node.title}`));
                  if (isDeletedFolder) {
                    modified = true;
                    return false;
                  }
                  if (node.children) {
                    const newChildren = processTree(node.children);
                    if (newChildren.length !== node.children.length) modified = true;
                    node.children = newChildren;
                  }
                }
                return true;
              });
            };

            const newLinks = processTree(links);
            if (modified) {
              page.content = JSON.stringify(newLinks);
              await savePage(page);
            }
          } catch (e) {
            console.error('Error processing page links for cascading delete:', e);
          }
        }
      }
    } catch (e) {
      console.error('Failed to sync deletions to pages:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
