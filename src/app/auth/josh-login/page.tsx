import { redirect } from 'next/navigation';

// Temporary convenience page: redirect /auth/josh-login -> /auth
// There is an API route at /api/auth/josh-login but no page at /auth/josh-login,
// so visiting /auth/josh-login returned 404. This server component redirects users
// to the main auth page at /auth where the login form lives.
export default function Page() {
  redirect('/auth');
}
