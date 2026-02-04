'use client';

import { create } from 'zustand';
import { Post, User, DEMO_POSTS, DEMO_USERS, PostStatus, PostFilter, TaggedMember } from './types';
import { getPosts, createPost as createPostInDB, updatePostStatus as updatePostStatusInDB } from './supabase/posts';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Posts
  posts: Post[];
  loading: boolean;
  
  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  loadPosts: () => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'status' | 'authorName'> & { authorName: string }) => Promise<void>;
  updatePostStatus: (postId: string, status: PostStatus, rejectionReason?: string) => Promise<void>;
  getPendingPosts: () => Post[];
  getApprovedPosts: () => Post[];
  getPostsByAuthor: (authorName: string) => Post[];
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  posts: [],
  loading: false,
  
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
  
  loadPosts: async () => {
    set({ loading: true });
    try {
      const posts = await getPosts();
      set({ posts, loading: false });
    } catch (error) {
      console.error('Failed to load posts:', error);
      set({ posts: DEMO_POSTS, loading: false }); // Fallback to demo posts
    }
  },
  
  createPost: async (postData) => {
    const { currentUser } = get();
    if (!currentUser) return;
    
    try {
      await createPostInDB({
        title: postData.title,
        description: postData.description,
        filters: postData.filters,
        taggedMembers: postData.taggedMembers,
        images: postData.images,
        authorName: postData.authorName,
      });
      
      // Reload posts after creating
      await get().loadPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  },
  
  updatePostStatus: async (postId: string, status: PostStatus, rejectionReason?: string) => {
    const { currentUser } = get();
    if (!currentUser || currentUser.role !== 'admin') return;
    
    try {
      await updatePostStatusInDB(postId, status, currentUser.id, rejectionReason);
      
      // Reload posts after updating
      await get().loadPosts();
    } catch (error) {
      console.error('Failed to update post status:', error);
    }
  },
  
  getPendingPosts: () => {
    return get().posts.filter(post => post.status === 'pending');
  },
  
  getApprovedPosts: () => {
    return get().posts.filter(post => post.status === 'approved');
  },
  
  getPostsByAuthor: (authorName: string) => {
    return get().posts.filter(post => post.authorName === authorName);
  }
}));
