export interface User {
  email: string;
  password: string;
  phone: string;
  type: 'member' | 'org' | 'admin';
  verified: boolean;
  followers: string[];
  groups: number[];
}

export interface Comment {
  userEmail: string;
  text: string;
  timestamp: number;
}

export interface Post {
  id: number;
  authorEmail: string;
  authorType: 'member' | 'org';
  title: string;
  description: string;
  postType: 'job' | 'internship' | 'volunteering' | 'project';
  tags: string[];
  applicants: string[];
  comments: Comment[];
}

export interface Group {
  id: number;
  name: string;
  members: string[];
}

export interface Message {
  from: string;
  to: string;
  text: string;
  timestamp: number;
}
