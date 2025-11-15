"use client";
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  displayImageUrl?: string | null;
  views?: number;
  likes?: number;
  commentsCount?: number;
  createdAt?: string;
  author?: { email?: string };
};

const CATEGORIES = ['All Posts']; // expandable later by admin

export default function BlogListingPage() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/posts?status=SUBMITTED');
        const data = await res.json();
        if (res.ok) setPosts(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLike(id: number) {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'like' }) });
      const updated = await res.json();
      if (res.ok) setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  } catch {}
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="relative h-48 md:h-64 flex items-center justify-center bg-black/60">
        <h1 className="text-4xl md:text-6xl font-bold">Blog</h1>
      </header>

      <nav className="bg-zinc-800 py-4">
        <div className="container mx-auto px-4 flex gap-6 items-center">
          {CATEGORIES.map(cat => (
            <button key={cat} className="text-sm text-white/80 hover:text-[#95B75D]">{cat}</button>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {loading ? <div className="text-white/60">Loading...</div> : null}

        {/* Stack posts vertically. Each post is a flex container with two equal children (image / content). */}
        <div className="flex flex-col gap-8">
          {posts.map(p => (
            <article key={p.id} className="bg-zinc-900 border border-zinc-800 rounded overflow-hidden flex items-stretch">
              {/* LEFT: image column - matches dashboard preview style used in Edit/Delete */}
              <div className="w-1/2 flex-shrink-0 bg-zinc-900 overflow-hidden" style={{ height: 420 }}>
                {(p.displayImageUrl ?? p.imageUrl) ? (
                  <img src={p.displayImageUrl ?? p.imageUrl ?? undefined} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: 420, background: '#111' }} />
                )}
              </div>

              {/* RIGHT: content column */}
              <div className="w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <img src="/align_logo.png" alt="author" width={56} height={56} className="rounded-full" />
                    <a href="https://www.instagram.com/alignecommerce/" target="_blank" rel="noreferrer" className="text-sm text-white/80">Jon@align</a>
                    <span className="text-sm text-white/60 ml-2">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</span>
                    <span className="text-sm text-white/60 ml-2">• {Math.max(1, Math.round((p.content?.split(/\s+/).length ?? 0) / 200))} min read</span>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{p.title}</h2>

                  <p className="text-white/60 text-xl mb-6">{p.content?.slice(0, 300)}{p.content && p.content.length > 300 ? '…' : ''}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-6 text-white/60">
                    <div>{p.views ?? 0} views</div>
                    <div>{p.commentsCount ?? 0} comments</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => handleLike(p.id)} className="flex items-center gap-2 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9-7.07C-0.18 10.69 2.05 5 7 5c2.12 0 3.24 1.09 5 3 1.76-1.91 2.88-3 5-3 4.95 0 7.18 5.69 4 8.93C19 16.65 12 21 12 21z"/></svg>
                      <span>{p.likes ?? 0}</span>
                    </button>
                    <Link href={`/blog/${p.id}`} className="text-sm bg-zinc-800 border border-zinc-700 px-3 py-1 rounded">Read</Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
