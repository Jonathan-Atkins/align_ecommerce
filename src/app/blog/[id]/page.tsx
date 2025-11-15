"use client";
/* eslint-disable @next/next/no-img-element */
import React from 'react';

type Post = { id: number; title: string; content: string; imageUrl?: string | null; views?: number; likes?: number; commentsCount?: number; createdAt?: string };

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [post, setPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [shareOpen, setShareOpen] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        if (res.ok && mounted) setPost(data);
        // increment view
        await fetch(`/api/posts/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'view' }) });
      } catch {
        // ignore
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [id]);

  function shareTo(provider: string) {
    const url = `${location.origin}/blog/${id}`;
    const text = encodeURIComponent(post?.title ?? '');
    if (provider === 'mailto') {
      location.href = `mailto:?subject=${text}&body=${encodeURIComponent(url)}`;
    } else if (provider === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (provider === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${text}%20${encodeURIComponent(url)}`, '_blank');
    } else if (provider === 'linkedin') {
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${text}`, '_blank');
    } else if (provider === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    }
    setShareOpen(false);
  }

  async function toggleLike() {
    if (!post) return;
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'like' }) });
      const updated = await res.json();
      if (res.ok) setPost(updated);
    } catch {
      // ignore
    }
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!post) return <div className="p-8 text-white">Not found</div>;

  const readMins = Math.max(1, Math.round((post.content?.split(/\s+/).length ?? 0) / 200));

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-zinc-900">
          <div className="flex items-center gap-4 mb-4">
            <img src="/align_logo.png" alt="author" width={48} height={48} className="rounded-full" />
            <div>
              <a href="https://www.instagram.com/alignecommerce/" target="_blank" rel="noreferrer" className="text-white/90 block">Jon@align</a>
              <div className="text-white/60 text-sm">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''} • {readMins} min read</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setShareOpen(true)} className="px-3 py-1 border border-zinc-700 rounded">Share</button>
              <button onClick={toggleLike} className="px-3 py-1 border border-zinc-700 rounded">❤ {post.likes ?? 0}</button>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          {post.imageUrl ? <img src={post.imageUrl} alt="cover" style={{ width: '100%', height: 360, objectFit: 'cover' }} /> : null}
          <article className="prose prose-invert mt-6 text-white/90" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="mt-8 text-white/60">{post.views ?? 0} views • {post.commentsCount ?? 0} comments</div>
        </div>
      </main>

      {shareOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShareOpen(false)} />
          <div className="relative bg-zinc-900 p-6 rounded shadow border border-zinc-700">
            <h4 className="text-lg font-semibold mb-3">Share Post</h4>
            <div className="flex gap-3">
              <button onClick={() => shareTo('facebook')} className="px-3 py-2 bg-blue-600 rounded">Facebook</button>
              <button onClick={() => shareTo('x')} className="px-3 py-2 bg-sky-500 rounded">X</button>
              <button onClick={() => shareTo('linkedin')} className="px-3 py-2 bg-blue-700 rounded">LinkedIn</button>
              <button onClick={() => shareTo('mailto')} className="px-3 py-2 bg-zinc-700 rounded">Email</button>
              <button onClick={() => shareTo('copy')} className="px-3 py-2 bg-zinc-600 rounded">Copy link</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
