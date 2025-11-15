#!/usr/bin/env node
// Fetch submitted posts and DELETE the most recent one, reporting HTTP status codes
const POSTS_URL = 'http://localhost:3000/api/posts?status=SUBMITTED';

(async function(){
  try {
    console.log('GET', POSTS_URL);
    const listRes = await fetch(POSTS_URL);
    console.log('GET status:', listRes.status);
    const posts = await listRes.json();
    if (!Array.isArray(posts) || posts.length === 0) {
      console.log('No submitted posts found; nothing to delete.');
      process.exit(0);
    }
    const id = posts[0].id;
    console.log('Deleting post id:', id);
    const delRes = await fetch(`http://localhost:3000/api/posts/${id}`, { method: 'DELETE' });
    console.log('DELETE status:', delRes.status);
    if (delRes.status === 204) console.log('Delete returned 204 No Content (success).');
    else if (delRes.ok) console.log('Delete OK');
    else {
      const body = await delRes.text();
      console.log('Delete response body:', body);
    }
  } catch (err) {
    console.error('Error running test:', err);
    process.exit(1);
  }
})();
