'use client';

import { useState } from 'react';
import { ASMHeader } from '@/components/asm-header';
import { HomeView } from '@/components/home-view';
import { CreatePostForm } from '@/components/create-post-form';
import { AdminPanel } from '@/components/admin-panel';
import { PostsFeed } from '@/components/posts-feed';
import { useAppStore } from '@/lib/store';

type ViewType = 'home' | 'create' | 'admin' | 'posts';

export default function ASMStudentPostsDemo() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const { currentUser, isAuthenticated } = useAppStore();

  const handleNavigate = (view: ViewType) => {
    // Check permissions
    if (view === 'create' && (!isAuthenticated || currentUser?.role !== 'student')) {
      setCurrentView('home');
      return;
    }
    if (view === 'admin' && (!isAuthenticated || currentUser?.role !== 'admin')) {
      setCurrentView('home');
      return;
    }
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      
      case 'posts':
        return (
          <div className="min-h-screen bg-background py-8 px-4">
            <PostsFeed />
          </div>
        );
      
      case 'create':
        if (!isAuthenticated || currentUser?.role !== 'student') {
          return <HomeView onNavigate={handleNavigate} />;
        }
        return (
          <div className="min-h-screen bg-background py-8 px-4">
            <CreatePostForm onSuccess={() => handleNavigate('posts')} />
          </div>
        );
      
      case 'admin':
        if (!isAuthenticated || currentUser?.role !== 'admin') {
          return <HomeView onNavigate={handleNavigate} />;
        }
        return (
          <div className="min-h-screen bg-background py-8 px-4">
            <AdminPanel />
          </div>
        );
      
      default:
        return <HomeView onNavigate={handleNavigate} />;
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
