'use client';

import { useState, useEffect } from 'react';
import { ASMHeader } from '@/components/asm-header';
import { CreatePostForm } from '@/components/create-post-form';
import { AdminPanel } from '@/components/admin-panel';
import { PostsFeed } from '@/components/posts-feed';
import { LoginForm } from '@/components/login-form';
import { useAppStore } from '@/lib/store';

type ViewType = 'create' | 'admin' | 'posts';

export default function ASMStudentPostsDemo() {
  const [currentView, setCurrentView] = useState<ViewType>('posts');
  const { currentUser, isAuthenticated, loadPosts } = useAppStore();

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleNavigate = (view: ViewType) => {
    // Check permissions
    if (view === 'create' && (!isAuthenticated || currentUser?.role !== 'student')) {
      setCurrentView('posts');
      return;
    }
    if (view === 'admin' && (!isAuthenticated || currentUser?.role !== 'admin')) {
      setCurrentView('posts');
      return;
    }
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'posts':
        return (
          <div className="min-h-screen bg-background py-8 px-4">
            <PostsFeed />
          </div>
        );
      
      case 'create':
        if (!isAuthenticated || currentUser?.role !== 'student') {
          return (
            <div className="min-h-screen bg-background py-8 px-4">
              <PostsFeed />
            </div>
          );
        }
        return (
          <div className="min-h-screen bg-background py-8 px-4">
            <CreatePostForm onSuccess={() => handleNavigate('posts')} />
          </div>
        );
      
      case 'admin':
        if (!isAuthenticated || currentUser?.role !== 'admin') {
          return (
            <div className="min-h-screen bg-background py-8 px-4">
              <PostsFeed />
            </div>
          );
        }
        return (
          <div className="min-h-screen bg-background py-8 px-4">
            <AdminPanel />
          </div>
        );
      
      default:
        return (
          <div className="min-h-screen bg-background py-8 px-4">
            <PostsFeed />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ASMHeader currentView={currentView} onNavigate={handleNavigate} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}
