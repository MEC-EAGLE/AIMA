import { User, Post, Group, Message } from './types';

export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

export function saveUsers(users: User[]) {
  localStorage.setItem('users', JSON.stringify(users));
}

export function getPosts(): Post[] {
  return JSON.parse(localStorage.getItem('posts') || '[]');
}

export function savePosts(posts: Post[]) {
  localStorage.setItem('posts', JSON.stringify(posts));
}

export function getGroups(): Group[] {
  return JSON.parse(localStorage.getItem('groups') || '[]');
}

export function saveGroups(groups: Group[]) {
  localStorage.setItem('groups', JSON.stringify(groups));
}

export function getMessages(): Message[] {
  return JSON.parse(localStorage.getItem('messages') || '[]');
}

export function saveMessages(msgs: Message[]) {
  localStorage.setItem('messages', JSON.stringify(msgs));
}
