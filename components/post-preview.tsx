'use client';

import { Calendar, Users, Tag, ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/lib/types';

interface PostPreviewProps {
  post: Post;
  compact?: boolean;
}

export function PostPreview({ post, compact = false }: PostPreviewProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <article className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image placeholder */}
        <div className="aspect-video bg-muted flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
        </div>
        
        <div className="p-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-1 mb-2">
            {post.filters.slice(0, 2).map(filter => (
              <Badge key={filter} variant="secondary" className="text-xs">
                {filter}
              </Badge>
            ))}
            {post.filters.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{post.filters.length - 2}
              </Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {post.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.createdAt)}
            </span>
            <span>{post.authorName}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-card rounded-lg overflow-hidden">
      {/* Header with school branding */}
      <div className="bg-primary text-primary-foreground px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-sm">ASM</span>
          </div>
          <div>
            <p className="text-xs text-primary-foreground/80">American School of Milan</p>
            <p className="text-sm font-medium">Student Posts</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-4">{post.title}</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.filters.map(filter => (
            <Badge key={filter} className="bg-primary/10 text-primary border-primary/20">
              {filter}
            </Badge>
          ))}
        </div>
        
        {/* Image placeholder */}
        {post.images.length > 0 && (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
            <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Description */}
        <p className="text-foreground leading-relaxed mb-6">
          {post.description}
        </p>
        
        {/* Tagged Members */}
        {post.taggedMembers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants
            </h4>
            <div className="flex flex-wrap gap-2">
              {post.taggedMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {member.fullName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-sm">{member.fullName}</span>
                  {member.role && (
                    <span className="text-xs text-muted-foreground">({member.role})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Posted {formatDate(post.createdAt)}
          </span>
          <span>By {post.authorName}</span>
        </div>
      </div>
    </article>
  );
}
