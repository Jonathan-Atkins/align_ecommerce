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
const MAX_VISIBLE_NAV = 5; // configurable: max number of links to show before collapsing into More

export default function BlogListingPage() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeHearts, setActiveHearts] = React.useState<Record<number, boolean>>({});
  const [heroAnimate, setHeroAnimate] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      await fetchPosts('SUBMITTED');
      // trigger hero animation after mount
      setHeroAnimate(true);
    })();
  }, []);

  // Fetch posts helper - status defaults to SUBMITTED (published)
  async function fetchPosts(status: string = 'SUBMITTED') {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?status=${encodeURIComponent(status)}`);
      const data = await res.json();
      if (res.ok) setPosts(data);
    } catch (err) {
      // ignore for now
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  }

  // MiniNav component placed here so it can access React in the same module without extra files
  function MiniNav({ categories, onSelect }: { categories: string[]; onSelect: (cat: string) => void }) {
    const visibleCount = Math.min(categories.length, MAX_VISIBLE_NAV);
    const visible = categories.slice(0, visibleCount);
    const overflow = categories.slice(visibleCount);
    const [moreOpen, setMoreOpen] = React.useState(false);

    // close dropdown on outside click
    React.useEffect(() => {
      function onDoc(e: MouseEvent) {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        // if click outside any .mini-nav element, close
        if (!target.closest('.mini-nav')) setMoreOpen(false);
      }
      document.addEventListener('click', onDoc);
      return () => document.removeEventListener('click', onDoc);
    }, []);

    // compute container classes based on visible.length
    // single container: when <=2 links center them, when 3+ distribute with All Posts left-anchored
    const isCompact = visible.length <= 2;
    const containerClass = `mini-nav flex items-center w-full ${isCompact ? 'justify-center gap-6' : 'justify-between'}`;

    return (
      <div className={containerClass}>
        {/* left block: either centered group (for <=2) or the left-most item (All Posts) for 3+ */}
        {isCompact ? (
          <div className="flex items-center gap-6">
            {visible.map(cat => (
              <button key={cat} onClick={() => onSelect(cat)} className="text-sm text-white/80 hover:text-[#95B75D]">{cat}</button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* first item stays left-anchored */}
            {visible.slice(0, 1).map(cat => (
              <button key={cat} onClick={() => onSelect(cat)} className="text-sm text-white/80 hover:text-[#95B75D] flex-none">{cat}</button>
            ))}
            {/* middle items expand evenly */}
            {visible.slice(1).map((cat) => (
              <div key={cat} className="flex-1 text-center">
                <button className="text-sm text-white/80 hover:text-[#95B75D] w-full">{cat}</button>
              </div>
            ))}
          </div>
        )}

        {/* right block: show More dropdown if overflow exists (always on the right) */}
        {overflow.length > 0 ? (
          <div className="relative mini-nav">
            <button onClick={() => setMoreOpen(prev => !prev)} className="text-sm text-white/80 hover:text-[#95B75D]">
              More ▾
            </button>
            {moreOpen && (
              <div className="mini-nav-dropdown bg-zinc-900 border border-zinc-800 rounded shadow-md absolute right-0 mt-2 py-2">
                {overflow.map(o => (
                  <button key={o} onClick={() => { onSelect(o); setMoreOpen(false); }} className="block w-full text-left px-4 py-2 text-white/80 hover:bg-zinc-800">{o}</button>
                ))}
              </div>
            )}
          </div>
        ) : (
          // placeholder to keep spacing consistent when no overflow
          <div style={{ width: 0 }} />
        )}
      </div>
    );
  }

  async function handleLike(id: number) {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'like', delta: 1 }) });
      const updated = await res.json();
      if (res.ok && updated) setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch (err) {
      console.error('Failed to persist like', err);
    }
  }

  // per-article UI state: which article menu is open, and which article is being shared in the modal
  const [openMenu, setOpenMenu] = React.useState<number | null>(null);
  const [shareModalPost, setShareModalPost] = React.useState<Post | null>(null);
  const [copiedPostId, setCopiedPostId] = React.useState<number | null>(null);

  // close article menu on outside click or when Escape is pressed
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (!target.closest('.article-menu')) {
        setOpenMenu(null);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu(null);
    }

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header
        className="relative h-48 md:h-64 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/Blog.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
  <h1 className={`blog-hero-title text-3xl md:text-6xl lg:text-7xl font-extrabold ${heroAnimate ? 'hero-animate' : ''}`}>Blog</h1>
      </header>

      <nav className="bg-zinc-800 py-4">
        <div className="container mx-auto px-4">
          {/* Flexible mini-nav: center 1-2 links, space-evenly for 3+, and collapse extra links into a "More" dropdown */}
          <MiniNav
            categories={CATEGORIES}
            onSelect={(cat: string) => {
              // Map category to API status; All Posts shows SUBMITTED posts
              if (cat === 'All Posts') fetchPosts('SUBMITTED');
              else fetchPosts(cat);
            }}
          />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {loading ? <div className="text-white/60">Loading...</div> : null}

  {/* Stack posts vertically. Each post is a flex container with two equal children (image / content). */}
  {/* Increased gap between posts for more breathing room */}
  <div className="flex flex-col blog-list">
          {posts.map(p => (
            <article key={p.id} className="bg-zinc-900 border border-zinc-800 rounded overflow-hidden flex items-stretch relative">
              {/* floating article menu (three dots) */}
              <div className="absolute right-6 top-6 article-menu">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === p.id ? null : p.id); }}
                  aria-expanded={openMenu === p.id}
                  aria-haspopup="true"
                  className="p-2 rounded text-white/60 hover:text-white/90"
                  title="More"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                </button>

                {openMenu === p.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded shadow-md z-40">
                    <button
                      onClick={() => { setOpenMenu(null); setShareModalPost(p); }}
                      className="w-full text-left px-4 py-3 text-white/80 hover:bg-zinc-800"
                    >
                      Share Post
                    </button>
                  </div>
                )}
              </div>
              {/* LEFT: image column - 45% width, fills card height */}
              <div className="image-col bg-zinc-900 overflow-hidden">
                {(p.displayImageUrl ?? p.imageUrl) ? (
                  <img
                    src={p.displayImageUrl ?? p.imageUrl ?? undefined}
                    alt="cover"
                    className="post-cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 50%', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: 468, background: '#111' }} />
                )}
              </div>

              {/* RIGHT: content column */}
              <div className="content-col p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <img src="/align_logo.png" alt="author" width={99} height={99} className="rounded-full w-30 h-30" />
                    <a href="https://www.instagram.com/alignecommerce/" target="_blank" rel="noreferrer" className="text-sm text-white/80">Jon@align</a>
                    <span className="text-sm text-white/60 ml-2">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</span>
                    <span className="text-sm text-white/60 ml-2">• {Math.max(1, Math.round((p.content?.split(/\s+/).length ?? 0) / 200))} min read</span>
                  </div>

                  {/* three-dot menu (top-right of article) inserted earlier as absolute; render title below */}
                  <h2 className="text-3xl md:text-3xl font-bold mb-4 leading-tight">
                    <span className="green-pulse">{p.title}</span>
                  </h2>

                  <p className="text-white/60 text-xl mb-6">{p.content?.slice(0, 300)}{p.content && p.content.length > 300 ? '…' : ''}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-6 text-white/60">
                    <div>{p.views ?? 0} views</div>
                    <div>{p.commentsCount ?? 0} comments</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        // Always allow clicking: optimistic increment and persist each click
                        setPosts(prev => prev.map(item => item.id === p.id ? { ...item, likes: (item.likes ?? 0) + 1 } : item));

                        // Trigger the animation briefly
                        setActiveHearts(prev => ({ ...prev, [p.id]: true }));
                        setTimeout(() => setActiveHearts(prev => ({ ...prev, [p.id]: false })), 2200);

                        // Persist to server (server atomically increments likes). We send delta:1 explicitly.
                        void handleLike(p.id);
                      }}
                      className="inline-flex items-center gap-1 text-white"
                      aria-label={`Like post ${p.title}`}
                    >
                      <span className="stage inline-flex items-center gap-1">
                        <span className={"heart" + (activeHearts[p.id] ? " is-active" : "")} aria-hidden="true" />
                        <span className="like-count text-sm tabular-nums">{p.likes ?? 0}</span>
                      </span>
                    </button>
                    <Link href={`/blog/${p.id}`} className="text-sm bg-zinc-800 border border-zinc-700 px-3 py-1 rounded">Read</Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        {/* Share modal overlay */}
        {shareModalPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShareModalPost(null)} />
            <div className="relative bg-zinc-900 border border-zinc-800 rounded p-8 shadow-lg z-50 w-[420px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Share Post</h3>
                <button onClick={() => setShareModalPost(null)} className="text-white/60 hover:text-white">✕</button>
              </div>

              <div className="flex items-center justify-center gap-6">
                <a
                  className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + `/blog/${shareModalPost.id}`)}`}
                  target="_blank" rel="noreferrer"
                >f</a>

                <a
                  className="w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center text-white"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareModalPost.title)}&url=${encodeURIComponent(window.location.origin + `/blog/${shareModalPost.id}`)}`}
                  target="_blank" rel="noreferrer"
                >x</a>

                <a
                  className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + `/blog/${shareModalPost.id}`)}`}
                  target="_blank" rel="noreferrer"
                >in</a>

                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.origin + `/blog/${shareModalPost.id}`);
                      setCopiedPostId(shareModalPost.id);
                      setTimeout(() => setCopiedPostId(null), 1800);
                    } catch (e) {
                      console.error('copy failed', e);
                    }
                  }}
                  className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white"
                >🔗</button>
              </div>

              {copiedPostId === shareModalPost.id && (
                <div className="mt-4 text-center text-sm text-white/80">Link copied</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
