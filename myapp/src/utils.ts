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
  const res = await fetch(`${API}/${key}`);
  return res.json();
}

async function postJSON(key: string, data: any): Promise<void> {
  await fetch(`${API}/${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
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
