import { User, Post, Group, Message } from './types';

export async function hashString(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const API = 'http://localhost:3001';

async function fetchJSON(key: string): Promise<any> {
  try {
    const res = await fetch(`${API}/${key}`);
    if (!res.ok) throw new Error('Server response not OK');
    return await res.json();
  } catch (err) {
    console.error('Fetch failed for', key, err);
    throw err;
  }
}

async function postJSON(key: string, data: any): Promise<void> {
  try {
    await fetch(`${API}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('Post failed for', key, err);
    throw err;
  }
}

export async function getUsers(): Promise<User[]> {
  return await fetchJSON('users');
}

export async function saveUsers(users: User[]) {
  await postJSON('users', users);
}

export async function getPosts(): Promise<Post[]> {
  return await fetchJSON('posts');
}

export async function savePosts(posts: Post[]) {
  await postJSON('posts', posts);
}

export async function getGroups(): Promise<Group[]> {
  return await fetchJSON('groups');
}

export async function saveGroups(groups: Group[]) {
  await postJSON('groups', groups);
}

export async function getMessages(): Promise<Message[]> {
  return await fetchJSON('messages');
}

export async function saveMessages(msgs: Message[]) {
  await postJSON('messages', msgs);
}

export async function sendOtpEmail(email: string, otp: string) {
  await postJSON('send-otp', { email, otp });
}

export async function fetchIndeedTechJobs(
  query = 'tech',
  location = ''
): Promise<any[]> {
  const endpoint = import.meta.env.VITE_INDEED_ENDPOINT;
  const key = import.meta.env.VITE_INDEED_API_KEY;
  if (!endpoint || !key) return [];
  const url = new URL(endpoint);
  if (query) url.searchParams.set('q', query);
  if (location) url.searchParams.set('l', location);
  url.searchParams.set('limit', '10');
  const res = await fetch(url.toString(), {
    headers: { 'X-Api-Key': key },
  });
  if (!res.ok) throw new Error('Indeed API error');
  const data = await res.json();
  return data.results || data.jobs || [];
}
