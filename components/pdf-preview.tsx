'use client';

import { ImageIcon, Users, Tag, Calendar } from 'lucide-react';
import { Post } from '@/lib/types';

interface PDFPreviewProps {
  post: Post;
  orientation: 'portrait' | 'landscape';
}

export function PDFPreview({ post, orientation }: PDFPreviewProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (orientation === 'portrait') {
    // Portrait: Title, Images, Description, Tags, Filters (vertical layout)
    return (
      <div className="bg-card border-2 border-border rounded-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-xs">ASM</span>
              </div>
              <span className="text-xs font-medium">Student Posts</span>
            </div>
            <span className="text-xs text-primary-foreground/80">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <div className="p-4 flex flex-col h-[calc(100%-56px)]">
          {/* Title */}
          <h1 className="text-xl font-bold text-foreground mb-3 text-center">
            {post.title}
          </h1>

          {/* Image */}
          <div className="flex-1 min-h-0 bg-muted rounded-lg flex items-center justify-center mb-3">
            <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
          </div>

          {/* Description */}
          <p className="text-sm text-foreground leading-relaxed mb-3 line-clamp-4">
            {post.description}
          </p>

          {/* Tagged Members */}
          {post.taggedMembers.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Users className="h-3 w-3" />
                <span>Participants</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {post.taggedMembers.slice(0, 4).map((member, index) => (
                  <span key={index} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                    {member.fullName}
                  </span>
                ))}
                {post.taggedMembers.length > 4 && (
                  <span className="text-xs text-muted-foreground">+{post.taggedMembers.length - 4} more</span>
                )}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mt-auto">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Tag className="h-3 w-3" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {post.filters.map(filter => (
                <span key={filter} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {filter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landscape: Title (top-left), Desc (center-left), Tags (center-down left), Filters (bottom left), Images (center-right)
  return (
    <div className="bg-card border-2 border-border rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">ASM</span>
            </div>
            <div>
              <p className="text-xs text-primary-foreground/80">American School of Milan</p>
              <p className="text-sm font-medium">Student Posts</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
            <Calendar className="h-4 w-4" />
            {formatDate(post.createdAt)}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-6 p-6 h-[calc(100%-64px)]">
        {/* Left Column */}
        <div className="flex flex-col">
          {/* Title - Top Left */}
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {post.title}
          </h1>

          {/* Description - Center Left */}
          <p className="text-sm text-foreground leading-relaxed mb-4 flex-1">
            {post.description}
          </p>

          {/* Tagged Members - Center-Down Left */}
          {post.taggedMembers.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Users className="h-3 w-3" />
                <span>Participants</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {post.taggedMembers.map((member, index) => (
                  <span key={index} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                    {member.fullName}
                    {member.role && <span className="text-muted-foreground ml-1">({member.role})</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filters - Bottom Left */}
          <div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Tag className="h-3 w-3" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {post.filters.map(filter => (
                <span key={filter} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  {filter}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Images */}
        <div className="bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="h-20 w-20 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Event Image</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-primary/5 px-6 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <span>Posted by {post.authorName}</span>
        <span>American School of Milan - Curious Learners, Critical Thinkers, Global Citizens</span>
      </div>
    </div>
  );
}
