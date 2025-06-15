import { User, Post, Group, Message } from './types';

const API = 'http://localhost:3001';

async function fetchJSON(key: string): Promise<any> {
  try {
    const res = await fetch(`${API}/${key}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${key}: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err: any) {
    throw new Error(`Request failed for ${key}: ${err instanceof Error ? err.message : err}`);
  }
}

async function postJSON(key: string, data: any): Promise<void> {
  try {
    const res = await fetch(`${API}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Failed to post ${key}: ${res.status} ${res.statusText}`);
    }
  } catch (err: any) {
    throw new Error(`Request failed for ${key}: ${err instanceof Error ? err.message : err}`);
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
