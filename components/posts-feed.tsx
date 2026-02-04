'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, Grid, List, ChevronDown } from 'lucide-react';
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

export function PostsFeed() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<PostFilter[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { getApprovedPosts } = useAppStore();
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

          <div className="flex border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
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

      {/* Posts Grid/List */}
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
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <button
              key={post.id}
              type="button"
              onClick={() => setSelectedPost(post)}
              className="text-left cursor-pointer"
            >
              <PostPreview post={post} compact />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <button
              key={post.id}
              type="button"
              onClick={() => setSelectedPost(post)}
              className="w-full text-left bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <Grid className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.filters.map(filter => (
                      <Badge key={filter} variant="secondary" className="text-xs">
                        {filter}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 truncate">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span>By {post.authorName}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Post Details</DialogTitle>
          </DialogHeader>
          {selectedPost && <PostPreview post={selectedPost} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
