'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { FILTERS, PostFilter, Post } from '@/lib/types';
import { PostPreview } from './post-preview';
import { LoginForm } from './login-form';

export function PostsFeed() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<PostFilter[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { getApprovedPosts, isAuthenticated } = useAppStore();
  const approvedPosts = getApprovedPosts();

  // Filter posts based on search and filters
  const filteredPosts = approvedPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = selectedFilters.length === 0 ||
      post.filters.some(f => selectedFilters.includes(f));
    
    return matchesSearch && matchesFilters;
  });

  const toggleFilter = (filter: PostFilter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setSearchQuery('');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Student Posts</h1>
        <p className="text-muted-foreground">
          Discover the latest news, events, and achievements from the ASM community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-32 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {selectedFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedFilters.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {FILTERS.map(filter => (
                <DropdownMenuCheckboxItem
                  key={filter}
                  checked={selectedFilters.includes(filter)}
                  onCheckedChange={() => toggleFilter(filter)}
                >
                  {filter}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedFilters.length > 0 || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ml-1 hover:text-destructive"
                aria-label="Remove search filter"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedFilters.map(filter => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <button
                type="button"
                onClick={() => toggleFilter(filter)}
                className="ml-1 hover:text-destructive"
                aria-label={`Remove ${filter} filter`}
              >
                ×
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            Clear all
          </Button>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
      </p>

      {/* Posts List - All posts displayed fully */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-muted/50 rounded-lg">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
              {/* Post Header */}
              <div className="bg-primary text-primary-foreground px-6 py-4">
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
                  <span className="text-sm text-primary-foreground/80">{formatDate(post.createdAt)}</span>
                </div>
              </div>

              {/* Post Content */}
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

                {/* Images */}
                {post.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {post.images.map((image, index) => (
                      <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground hidden">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                <p className="text-foreground leading-relaxed mb-6 whitespace-pre-wrap">
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
          ))}
        </div>
      )}

      {/* Login Section */}
      {!isAuthenticated && (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Login to Create Posts</h3>
            <p className="text-muted-foreground mb-6">
              Students can create posts, and administrators can approve them.
            </p>
            <LoginForm />
          </div>
        </div>
      )}
    </div>
  );
}
