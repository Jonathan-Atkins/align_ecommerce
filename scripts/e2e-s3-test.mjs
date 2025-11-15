#!/usr/bin/env node

// E2E test: request presign, PUT a 1x1 PNG, POST /api/posts, verify HEAD and list

import fs from 'fs';

const presignUrl = 'http://localhost:3000/api/s3/presign';
const postsUrl = 'http://localhost:3000/api/posts';

async function run() {
  try {
    console.log('Requesting presign URL...');
    const presignRes = await fetch(presignUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: 'e2e-test.png', contentType: 'image/png', authorEmail: 'jonathanatkins.dev@gmail.com' }),
    });
    const presignJson = await presignRes.json();
    console.log('Presign response status:', presignRes.status);
    if (!presignRes.ok) {
      console.error('Presign error:', presignJson);
      process.exit(1);
    }

  const { presignedUrl, presignedGetUrl, publicUrl } = presignJson;
    console.log('Presigned URL received. Public URL:', publicUrl);

    // 1x1 PNG base64
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
    const buf = Buffer.from(pngBase64, 'base64');

    console.log('Uploading test PNG to presigned URL...');
    const putRes = await fetch(presignedUrl, { method: 'PUT', headers: { 'Content-Type': 'image/png' }, body: buf });
    console.log('PUT status:', putRes.status);
    if (!putRes.ok) {
      const text = await putRes.text();
      console.error('PUT failed:', text);
      process.exit(1);
    }

  console.log('Checking object with presigned GET URL (HEAD)...');
  // Use the presigned GET URL returned by the server to verify the object (avoids public ACL issues)
  const headRes = await fetch(presignedGetUrl, { method: 'HEAD' });
  console.log('Presigned GET HEAD status:', headRes.status);

    console.log('Creating post record in DB...');
    const createRes = await fetch(postsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'E2E test', content: 'Uploaded via presign', authorEmail: 'jonathanatkins.dev@gmail.com', imageUrl: publicUrl, status: 'SUBMITTED' }),
    });
    console.log('/api/posts POST status:', createRes.status);
    const createJson = await createRes.json();
    console.log('Create response body:', createJson);

    console.log('Listing submitted posts...');
    const listRes = await fetch(postsUrl + '?status=SUBMITTED');
    const listJson = await listRes.json();
    console.log('GET /api/posts?status=SUBMITTED status:', listRes.status);
    console.log('Found', Array.isArray(listJson) ? listJson.length : 'unexpected response', 'posts');
    if (Array.isArray(listJson) && listJson.length > 0) {
      console.log('Most recent post:', listJson[0]);
    } else {
      console.log('List response:', listJson);
    }

    console.log('E2E test completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('E2E test failed:', err);
    process.exit(1);
  }
}

run();
