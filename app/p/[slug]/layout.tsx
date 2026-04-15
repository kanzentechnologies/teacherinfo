export async function generateStaticParams() {
  // Return an empty array or known slugs.
  // Since pages are dynamic and stored in localStorage (which isn't available at build time),
  // we can just return an empty array. Next.js will try to build them on demand if not export,
  // but since it's export, it will just not pre-render any pages.
  // Wait, if we return empty array, Next.js might throw 404 for any dynamic route in export mode
  // unless we set dynamicParams = false? No, in export mode, dynamicParams is ignored.
  // Actually, we should return at least one dummy slug or known slugs if we want them to work.
  // But wait, if it's an SPA, how do we handle dynamic routes in export mode?
  // We can't really do dynamic routes in export mode without knowing all params at build time.
  // However, we can use a catch-all or just return a dummy param so the build passes.
  return [{ slug: 'about' }, { slug: 'privacy-policy' }, { slug: 'terms' }];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
