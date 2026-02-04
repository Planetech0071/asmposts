'use client';

import { create } from 'zustand';
import { Post, User, DEMO_POSTS, DEMO_USERS, PostStatus, PostFilter, TaggedMember } from './types';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Posts
  posts: Post[];
  
  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'status' | 'authorId' | 'authorName'>) => void;
  updatePostStatus: (postId: string, status: PostStatus, rejectionReason?: string) => void;
  getPendingPosts: () => Post[];
  getApprovedPosts: () => Post[];
  getPostsByAuthor: (authorId: string) => Post[];
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  posts: DEMO_POSTS,
  
  login: (username: string, password: string) => {
    const user = DEMO_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },
  
  createPost: (postData) => {
    const { currentUser, posts } = get();
    if (!currentUser) return;
    
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      status: 'pending',
      createdAt: new Date()
    };
    
    set({ posts: [...posts, newPost] });
  },
  
  updatePostStatus: (postId: string, status: PostStatus, rejectionReason?: string) => {
    const { currentUser, posts } = get();
    if (!currentUser || currentUser.role !== 'admin') return;
    
    set({
      posts: posts.map(post =>
        post.id === postId
          ? {
              ...post,
              status,
              reviewedAt: new Date(),
              reviewedBy: currentUser.id,
              rejectionReason: rejectionReason || undefined
            }
          : post
      )
    });
  },
  
  getPendingPosts: () => {
    return get().posts.filter(post => post.status === 'pending');
  },
  
  getApprovedPosts: () => {
    return get().posts.filter(post => post.status === 'approved');
  },
  
  getPostsByAuthor: (authorId: string) => {
    return get().posts.filter(post => post.authorId === authorId);
  }
}));
