import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching nav items...');
  const { data: navItems } = await supabase.from('nav_items').select('*');
  
  if (!navItems) return;

  const pages = navItems.filter(item => item.is_page);
  console.log(`Found ${pages.length} pages to migrate.`);
  
  for (const page of pages) {
    const post = {
      id: page.id,
      title: page.title,
      slug: page.slug,
      categorySlug: 'pages',
      content: page.content || '',
      status: page.status || 'Published',
      date: new Date().toISOString(),
      type: 'page',
    };
    await supabase.from('posts').upsert(post);
  }
  
  console.log('Updated Menu Links (converting pages to links in nav_items)');
  for (const page of pages) {
    // Convert to a menu link that points to the page
    await supabase.from('nav_items').update({
      is_page: false,
      externalUrl: `/${page.slug}`
    }).eq('id', page.id);
  }
  console.log('Done!');
}
run();
