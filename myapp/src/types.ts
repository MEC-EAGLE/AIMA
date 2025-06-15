export interface User {
  email: string;
  password: string;
  phone: string;
  type: 'member' | 'org' | 'admin';
  verified: boolean;
  followers: string[];
  groups: number[];
}

export interface Post {
  id: number;
  orgEmail: string;
  title: string;
  description: string;
  postType: 'job' | 'internship' | 'volunteering' | 'project';
  tags: string[];
  applicants: string[];
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
