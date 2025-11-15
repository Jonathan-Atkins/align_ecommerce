"use client";
import React, { useState } from 'react';
// shared post/draft shape used by Drafts/Create
type Post = { id: number; title: string; content: string; image?: string | null; imageUrl?: string | null; submitted?: boolean; displayImageUrl?: string | null };
import Image from 'next/image';
import Link from 'next/link';

// Allowed image MIME types for uploads. Excludes image/avif intentionally.
const ALLOWED_IMAGE_MIME = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
  'image/x-icon',
  'image/heic'
];

// Josh's dashboard page — owner-only area to create/edit/delete blogs.
export default function JoshsDashboard() {
  const [selected, setSelected] = useState<'create' | 'edit' | 'delete' | 'drafts'>('create');
  // saved drafts live at the dashboard level so Drafts and Create can share them
  const [savedDrafts, setSavedDrafts] = useState<Post[]>([]);
  const [draftToEdit, setDraftToEdit] = useState<Post | null>(null);
  const [draftToast, setDraftToast] = useState<string | null>(null);

  // show toast briefly
  React.useEffect(() => {
    if (!draftToast) return;
    const id = setTimeout(() => setDraftToast(null), 3000);
    return () => clearTimeout(id);
  }, [draftToast]);

  return (
    <>
      {/* Toast animation keyframes used by undo snackbars */}
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {/* Fixed full-viewport black background behind everything */}
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000000', zIndex: -50 }} />

      <div className="min-h-screen flex">
        {/* Left sidebar */}
        <aside className="w-64 bg-zinc-900/80 border-r border-zinc-800 p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Josh&apos;s Dashboard</h2>
          <nav className="flex flex-col gap-3">
            <button
              className={`text-left px-4 py-2 rounded ${selected === 'create' ? 'text-white' : 'text-white bg-transparent hover:bg-zinc-800'}`}
              onClick={() => { setSelected('create'); setDraftToEdit(null); }}
              // inline style to ensure immediate highlight without needing a Tailwind rebuild
              style={selected === 'create' ? { backgroundColor: '#95B75D', color: '#ffffff' } : undefined}
            >
              Create
            </button>
            <button
              className={`text-left px-4 py-2 rounded ${selected === 'edit' ? 'bg-yellow-400 text-black' : 'text-white bg-transparent hover:bg-zinc-800'}`}
              onClick={() => setSelected('edit')}
            >
              Edit
            </button>
            <button
              className={`text-left px-4 py-2 rounded ${selected === 'delete' ? 'bg-red-600 text-white' : 'text-white bg-transparent hover:bg-zinc-800'}`}
              onClick={() => setSelected('delete')}
            >
              Delete
            </button>
            <button
              className={`text-left px-4 py-2 rounded ${selected === 'drafts' ? 'text-white' : 'text-white bg-transparent hover:bg-zinc-800'}`}
              onClick={() => setSelected('drafts')}
            >
              Drafts
            </button>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-8">
          {selected === 'create' && (
            <CreateSection
              savedDrafts={savedDrafts}
              setSavedDrafts={setSavedDrafts}
              draftToEdit={draftToEdit}
              setDraftToEdit={setDraftToEdit}
              onDraftSaved={(msg: string) => setDraftToast(msg)}
            />
          )}

          {selected === 'edit' && (
            <EditSection />
          )}

          {selected === 'delete' && (
            <DeleteSection />
          )}

          {selected === 'drafts' && (
            <DraftsSection
              savedDrafts={savedDrafts}
              setSavedDrafts={setSavedDrafts}
              onEditDraft={(d: Post) => { setDraftToEdit(d); setSelected('create'); }}
            />
          )}

          {/* draft toast */}
          {draftToast ? (
            <div className="fixed top-6 right-6 bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded shadow">{draftToast}</div>
          ) : null}
        </main>
      </div>
    </>
  );
}

function DeleteSection() {
  type Post = { id: number; title: string; content: string; image?: string | null; displayImageUrl?: string | null };
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<null | { post: Post; timeoutId: number }>(null);
  const [confirmPost, setConfirmPost] = React.useState<Post | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/posts?status=SUBMITTED');
      const data = await res.json();
      if (res.ok) setPosts(data);
      else console.error(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  function scheduleDelete(post: Post) {
    // remove from UI immediately
    setPosts(prev => prev.filter(p => p.id !== post.id));
    // start timer to call server-side delete (allow undo)
    const timeoutId = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
        if (!res.ok && res.status !== 204) {
          console.error('Delete failed', await res.text());
        }
      } catch (err) {
        console.error('Delete error', err);
      } finally {
        setPendingDelete(null);
      }
    }, 60000); // 1 minute undo window

    // store pending delete so user can undo
    setPendingDelete({ post, timeoutId });
  }

  function undoDelete() {
    if (!pendingDelete) return;
    window.clearTimeout(pendingDelete.timeoutId);
    // put the post back at the top
    setPosts(prev => [pendingDelete.post, ...prev]);
    setPendingDelete(null);
  }

  // When user clicks trash, open modal to confirm
  function onRequestDelete(post: Post) {
    setConfirmPost(post);
  }

  function onConfirmDelete() {
    if (!confirmPost) return;
    scheduleDelete(confirmPost);
    setConfirmPost(null);
  }

  return (
    <section>
      <h3 className="text-2xl font-bold text-white mb-4">Delete</h3>
      {loading && <div className="text-white/60">Loading...</div>}
      {!loading && posts.length === 0 && <div className="text-white/60">No submitted posts found.</div>}

      <div className="grid grid-cols-1 gap-4">
        {posts.map(p => (
          <article key={p.id} className="bg-zinc-900 p-4 rounded flex items-start gap-6">
            <div style={{ width: 240, height: 160, background: '#111', flexShrink: 0 }}>
              {(p.displayImageUrl ?? p.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.displayImageUrl ?? p.image ?? undefined} alt="preview" style={{ width: '240px', height: '160px', objectFit: 'cover' }} />
              ) : null}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white">{p.title}</h4>
              <p className="text-white/60">{p.content.slice(0, 200)}</p>
            </div>
            <div className="flex items-start">
        <button
          onClick={() => onRequestDelete(p)}
                className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow"
                title="Delete post"
              >
                {/* trash icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M9 3v1H4v2h16V4h-5V3H9zm1 6v8h2V9H10zM6 7v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6z" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>
      {/* Modal confirmation for delete */}
      {confirmPost ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmPost(null)} />
          <div className="relative bg-zinc-900 p-6 rounded shadow border border-zinc-700 w-full max-w-md">
            <h4 className="text-lg font-semibold text-white mb-2">Confirm delete</h4>
            <p className="text-white/70 mb-4">Are you sure you want to delete &quot;{confirmPost.title}&quot;? This will remove the DB record and the associated image. You can still undo for 1 minute after confirming.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmPost(null)} className="border border-zinc-700 text-white px-3 py-2 rounded">Cancel</button>
              <button onClick={onConfirmDelete} className="bg-red-600 text-white px-3 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      ) : null}
      {/* Toast / snackbar for undo */}
      {pendingDelete ? (
        <div style={{ animation: 'toastIn 300ms ease' }} className="fixed bottom-6 right-6 bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded shadow flex items-center gap-4">
          <div>Post deleted.</div>
          <button onClick={undoDelete} className="underline text-sm">Undo</button>
        </div>
      ) : null}
    </section>
  );
}

function DraftsSection({ savedDrafts, setSavedDrafts, onEditDraft }: { savedDrafts: Post[]; setSavedDrafts: React.Dispatch<React.SetStateAction<Post[]>>; onEditDraft: (d: Post) => void }) {
  React.useEffect(() => {
    // fetch server-side drafts when DraftsSection mounts
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/posts?status=DRAFT');
        const data = await res.json();
        if (res.ok && mounted) setSavedDrafts(data);
      } catch {
        // ignore fetch errors
      }
    })();
    return () => { mounted = false; };
  }, [setSavedDrafts]);

  return (
    <section>
      <h3 className="text-2xl font-bold text-white mb-4">Drafts</h3>
      {savedDrafts.length === 0 ? <div className="text-white/60">No drafts yet.</div> : null}
      <div className="grid grid-cols-1 gap-4">
        {savedDrafts.map(d => (
          <article key={d.id} className="bg-zinc-900 p-4 rounded flex items-start gap-6">
            <div style={{ width: 240, height: 160, background: '#111', flexShrink: 0 }}>
              {d.imageUrl || d.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.imageUrl ?? d.image} alt="preview" style={{ width: '240px', height: '160px', objectFit: 'cover' }} />
              ) : null}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white">{d.title}</h4>
              <p className="text-white/60">{d.content.slice(0, 200)}</p>
            </div>
            <div className="flex items-start">
              <button
                onClick={() => onEditDraft(d)}
                className="w-10 h-10 rounded-full bg-zinc-700 text-white flex items-center justify-center shadow"
                title="Edit draft"
              >
                {/* pen icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CreateSection({ savedDrafts, setSavedDrafts, draftToEdit, setDraftToEdit, onDraftSaved }: { savedDrafts: Post[]; setSavedDrafts: React.Dispatch<React.SetStateAction<Post[]>>; draftToEdit: Post | null; setDraftToEdit: React.Dispatch<React.SetStateAction<Post | null>>; onDraftSaved: (msg: string) => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string | null>(null);

  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);

  // when a draft is selected for edit, populate the form
  React.useEffect(() => {
    if (!draftToEdit) return;
    setTitle(draftToEdit.title ?? '');
    setContent(draftToEdit.content ?? '');
    setPreviewUrl(draftToEdit.image ?? draftToEdit.imageUrl ?? null);
    setPreviewFileName(draftToEdit.image || draftToEdit.imageUrl ? 'Existing image' : null);
  }, [draftToEdit]);
  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // validate mime
    if (!ALLOWED_IMAGE_MIME.includes(f.type)) {
      setFileError('Unsupported file type. Allowed: JPG, PNG, WEBP, GIF, SVG, BMP, ICO, HEIC. (.avif not supported)');
      // clear selection
      if (fileRef.current) fileRef.current.value = '';
      setPreviewUrl(null);
      setPreviewFileName(null);
      return;
    }
    setFileError(null);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setPreviewFileName(f.name);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      let finalImageUrl: string | null = previewUrl ?? null;
      const file = fileRef.current?.files && fileRef.current.files[0];
      if (file) {
        // request presign
        const res = await fetch('/api/s3/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type, authorEmail: 'jonathanatkins.dev@gmail.com' }),
        });
        const presign = await res.json();
        if (!res.ok) throw new Error(presign.error || 'Presign failed');

        // PUT to S3
        const putRes = await fetch(presign.presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!putRes.ok) throw new Error('S3 upload failed');
        finalImageUrl = presign.presignedGetUrlLong ?? presign.publicUrl;
      }

      if (draftToEdit) {
        // update existing draft on server
        const res = await fetch(`/api/posts/${draftToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, imageUrl: finalImageUrl ?? null, status: 'DRAFT' }),
        });
        const updated = await res.json();
        if (!res.ok) throw new Error(updated.error || 'Update draft failed');
        setSavedDrafts(prev => prev.map(d => d.id === updated.id ? updated : d));
        setDraftToEdit(null);
        onDraftSaved('Draft updated');
      } else {
        // create draft on server
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, imageUrl: finalImageUrl, authorEmail: 'jonathanatkins.dev@gmail.com', status: 'DRAFT' }),
        });
        const created = await res.json();
        if (!res.ok) throw new Error(created.error || 'Create draft failed');
        setSavedDrafts([created, ...savedDrafts]);
        onDraftSaved('Added to Drafts');
      }

      // clear form
      setTitle('');
      setContent('');
      setPreviewUrl(null);
      setPreviewFileName(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      alert(String(err));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // If there's a selected file, upload via presign flow
    let finalImageUrl: string | null = previewUrl ?? null;
    try {
      const file = fileRef.current?.files && fileRef.current.files[0];
      if (file) {
        // request presign
        const res = await fetch('/api/s3/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type, authorEmail: 'jonathanatkins.dev@gmail.com' }),
        });
        const presign = await res.json();
        if (!res.ok) throw new Error(presign.error || 'Presign failed');

        // PUT to S3
        const putRes = await fetch(presign.presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!putRes.ok) throw new Error('S3 upload failed');
        // Prefer a long-lived presigned GET if provided so the UI can display the image
        finalImageUrl = presign.presignedGetUrlLong ?? presign.publicUrl;
      }

      // Create the post in DB
      const createRes = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrl: finalImageUrl, authorEmail: 'jonathanatkins.dev@gmail.com', status: 'SUBMITTED' }),
      });
      const created = await createRes.json();
      if (!createRes.ok) throw new Error(created.error || 'Create post failed');

  // created post returned from server is in `created` if needed for UI; no local draft update required here

      // clear form
      setTitle('');
      setContent('');
      setPreviewUrl(null);
      setPreviewFileName(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      alert(String(err));
    }
  }

  return (
    <section>
      <h3 className="text-2xl font-bold text-white mb-4">Create</h3>

  <form onSubmit={handleSave} className="space-y-4 text-white">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" rows={6} />
        </div>
        <div>
          <label className="block text-sm mb-1">Feature image</label>
          <div className="flex items-center">
            <label
              htmlFor="feature-image"
              className="inline-block bg-zinc-800 border border-zinc-700 px-4 py-2 rounded cursor-pointer text-white"
              onClick={() => fileRef.current?.click()}
            >
              Choose File
            </label>
            <input id="feature-image" ref={fileRef} type="file" accept={ALLOWED_IMAGE_MIME.join(',')} onChange={onImageChange} className="sr-only" />
            <span className="ml-4 text-sm text-white/60">{previewFileName ?? 'No file chosen'}</span>
          </div>
          {fileError ? <div className="text-sm text-red-400 mt-2">{fileError}</div> : (
            <div className="text-sm text-white/60 mt-2">Allowed: JPG, PNG, WEBP, GIF, SVG, BMP, ICO, HEIC</div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1" />
          <button
            type="submit"
            className="px-4 py-2 rounded"
            style={{ backgroundColor: '#95B75D', color: '#ffffff' }}
          >
            Save as Draft
          </button>
          <button type="button" onClick={handleSubmit} className="border border-zinc-700 text-white px-4 py-2 rounded">Submit</button>
        </div>
      </form>

      {/* Preview of saved posts */}
      <div className="mt-8 space-y-6">
        {savedDrafts.map(post => (
          <article key={post.id} className="bg-zinc-900 p-4 rounded">
            <div className="flex gap-6">
              {(post.image ?? post.imageUrl) ? (
                // simple preview of the uploaded image
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(post.image ?? post.imageUrl) ?? undefined} alt="preview" style={{ width: 240, height: 160, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 240, height: 160, background: '#111' }} />
              )}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {post.submitted ? (
                    <>
                      <Image src="/align_logo.png" alt="owner" width={32} height={32} className="rounded-full" />
                      <Link href="https://www.instagram.com/alignecommerce/" target="_blank" className="text-sm text-white/80">Jon@align</Link>
                    </>
                  ) : null}
                </div>
                <h4 className="text-xl font-bold text-white">{post.title}</h4>
                <p className="text-white/60">{post.content}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EditSection() {
  type Post = { id: number; title: string; content: string; image?: string | null; displayImageUrl?: string | null };
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingDeleteEdit, setPendingDeleteEdit] = useState<null | { post: Post; timeoutId: number }>(null);
  const [confirmEditPost, setConfirmEditPost] = useState<Post | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const replaceFileRef = React.useRef<HTMLInputElement | null>(null);
  const [replacePreviewUrl, setReplacePreviewUrl] = useState<string | null>(null);
  const [replaceFileName, setReplaceFileName] = useState<string | null>(null);
  const [editFileError, setEditFileError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/posts?status=SUBMITTED');
      const data = await res.json();
      if (res.ok) setPosts(data);
      else console.error(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  function openEditor(p: Post) {
    setEditing(p);
    setTitle(p.title);
    setContent(p.content);
    setReplacePreviewUrl(null);
    setReplaceFileName(null);
  }

  function cancelEdit() {
    setEditing(null);
    setTitle('');
    setContent('');
  }

  function onReplaceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!ALLOWED_IMAGE_MIME.includes(f.type)) {
      setEditFileError('Unsupported file type. Allowed: JPG, PNG, WEBP, GIF, SVG, BMP, ICO, HEIC. (.avif not supported)');
      if (replaceFileRef.current) replaceFileRef.current.value = '';
      setReplacePreviewUrl(null);
      setReplaceFileName(null);
      return;
    }
    setEditFileError(null);
    const url = URL.createObjectURL(f);
    setReplacePreviewUrl(url);
    setReplaceFileName(f.name);
  }

  async function submitEdit() {
    if (!editing) return;
    try {
      let finalImageUrl: string | undefined = undefined;
      const replaceFile = replaceFileRef.current?.files && replaceFileRef.current.files[0];
      if (replaceFile) {
        // presign
        const presignRes = await fetch('/api/s3/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: replaceFile.name, contentType: replaceFile.type, authorEmail: 'jonathanatkins.dev@gmail.com' }),
        });
        const presign = await presignRes.json();
        if (!presignRes.ok) throw new Error(presign.error || 'Presign failed');

        const putRes = await fetch(presign.presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': replaceFile.type },
          body: replaceFile,
        });
        if (!putRes.ok) throw new Error('S3 upload failed');
        finalImageUrl = presign.presignedGetUrlLong ?? presign.publicUrl;
      }

      const res = await fetch(`/api/posts/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, status: 'SUBMITTED', imageUrl: finalImageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      // refresh list
      // update local list quickly
      if (finalImageUrl) {
        setPosts(prev => prev.map(p => p.id === editing.id ? { ...p, title, content, image: finalImageUrl } : p));
      } else if (replacePreviewUrl) {
        // local preview only
        setPosts(prev => prev.map(p => p.id === editing.id ? { ...p, title, content, image: replacePreviewUrl } : p));
      } else {
        await load();
      }
      cancelEdit();
    } catch (e) {
      alert(String(e));
    }
  }

  return (
    <section>
      <h3 className="text-2xl font-bold text-white mb-4">Edit</h3>
      {loading && <div className="text-white/60">Loading...</div>}
      {!loading && posts.length === 0 && <div className="text-white/60">No submitted posts found.</div>}

      <div className="grid grid-cols-1 gap-4">
        {posts.map(p => (
          <article key={p.id} className="bg-zinc-900 p-4 rounded cursor-pointer" onClick={() => openEditor(p)}>
            <div className="flex gap-6 items-start">
              {(p.displayImageUrl ?? p.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.displayImageUrl ?? p.image ?? undefined} alt="preview" style={{ width: 240, height: 160, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 240, height: 160, background: '#111' }} />
              )}
              <div>
                <h4 className="text-xl font-bold text-white">{p.title}</h4>
                <p className="text-white/60">{p.content.slice(0, 200)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Editor modal/section */}
      {editing && (
        <div className="mt-6 bg-zinc-800 p-4 rounded">
          <h4 className="text-lg font-semibold text-white mb-2">Editing: {editing.title}</h4>

          {/* Current image and replacement preview */}
          <div className="mb-3">
            <label className="block text-sm mb-1 text-white">Image</label>
            <div className="flex items-center gap-4">
              {replacePreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={replacePreviewUrl} alt="replacement preview" style={{ width: 160, height: 120, objectFit: 'cover' }} />
              ) : editing.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.image} alt="current" style={{ width: 160, height: 120, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 160, height: 120, background: '#111' }} />
              )}

              <div>
                <label
                  htmlFor="replace-image"
                  className="inline-block bg-zinc-700 border border-zinc-600 px-3 py-2 rounded cursor-pointer text-white"
                  onClick={() => replaceFileRef.current?.click()}
                >
                  Replace image
                </label>
                <input id="replace-image" ref={replaceFileRef} type="file" accept={ALLOWED_IMAGE_MIME.join(',')} onChange={onReplaceChange} className="sr-only" />
                <div className="text-sm text-white/60 mt-2">{replaceFileName ?? 'No file chosen'}</div>
                {editFileError ? <div className="text-sm text-red-400 mt-2">{editFileError}</div> : (
                  <div className="text-sm text-white/60 mt-2">Allowed: JPG, PNG, WEBP, GIF, SVG, BMP, ICO, HEIC</div>
                )}
              </div>
            </div>
          </div>

          <label className="block text-sm mb-1 text-white">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 mb-3" />
          <label className="block text-sm mb-1 text-white">Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 mb-3" rows={8} />
          <div className="flex gap-3">
            <button onClick={submitEdit} className="bg-align-green text-black px-4 py-2 rounded">Submit</button>
            <button onClick={cancelEdit} className="border border-zinc-700 text-white px-4 py-2 rounded">Cancel</button>
            <button onClick={() => setConfirmEditPost(editing ?? null)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </div>
      )}
      {/* Edit delete confirmation modal */}
      {confirmEditPost ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmEditPost(null)} />
          <div className="relative bg-zinc-900 p-6 rounded shadow border border-zinc-700 w-full max-w-md">
            <h4 className="text-lg font-semibold text-white mb-2">Confirm delete</h4>
            <p className="text-white/70 mb-4">Are you sure you want to delete &quot;{confirmEditPost.title}&quot;? This will remove the DB record and the associated image. You can still undo for 1 minute after confirming.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmEditPost(null)} className="border border-zinc-700 text-white px-3 py-2 rounded">Cancel</button>
              <button onClick={async () => {
                const postToDelete = confirmEditPost;
                if (!postToDelete) return;
                // close editor and remove from UI
                cancelEdit();
                setPosts(prev => prev.filter(p => p.id !== postToDelete.id));
                setConfirmEditPost(null);
                const timeoutId = window.setTimeout(async () => {
                  try {
                    const res = await fetch(`/api/posts/${postToDelete.id}`, { method: 'DELETE' });
                    if (!res.ok && res.status !== 204) console.error('Delete failed', await res.text());
                  } catch (err) {
                    console.error('Delete error', err);
                  } finally {
                    setPendingDeleteEdit(null);
                  }
                }, 60000);
                setPendingDeleteEdit({ post: postToDelete, timeoutId });
              }} className="bg-red-600 text-white px-3 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      ) : null}
      {pendingDeleteEdit ? (
        <div style={{ animation: 'toastIn 300ms ease' }} className="fixed bottom-6 right-6 bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded shadow flex items-center gap-4">
          <div>Post deleted.</div>
          <button onClick={() => {
            if (!pendingDeleteEdit) return;
            window.clearTimeout(pendingDeleteEdit.timeoutId);
            setPosts(prev => [pendingDeleteEdit.post, ...prev]);
            setPendingDeleteEdit(null);
          }} className="underline text-sm">Undo</button>
        </div>
      ) : null}
    </section>
  );
}
