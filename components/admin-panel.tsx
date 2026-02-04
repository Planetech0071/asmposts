'use client';

import { useState } from 'react';
import { Check, X, Eye, Clock, FileText, Users, Tag, Download, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { Post } from '@/lib/types';
import { PostPreview } from './post-preview';
import { PDFPreview } from './pdf-preview';

export function AdminPanel() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [pdfOrientation, setPdfOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { posts, updatePostStatus, getPendingPosts, getApprovedPosts } = useAppStore();

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingPosts = getPendingPosts();
  const approvedPosts = getApprovedPosts();
  const rejectedPosts = posts.filter(p => p.status === 'rejected');

  const handleApprove = async (post: Post) => {
    await updatePostStatus(post.id, 'approved');
  };

  const handleReject = async () => {
    if (selectedPost) {
      await updatePostStatus(selectedPost.id, 'rejected', rejectionReason);
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedPost(null);
    }
  };

  const openRejectDialog = (post: Post) => {
    setSelectedPost(post);
    setShowRejectDialog(true);
  };

  const openPreview = (post: Post) => {
    setSelectedPost(post);
    setShowPreview(true);
  };

  const openPDFPreview = (post: Post, orientation: 'portrait' | 'landscape') => {
    setSelectedPost(post);
    setPdfOrientation(orientation);
    setShowPDFPreview(true);
  };

  const PostCard = ({ post, showActions = true }: { post: Post; showActions?: boolean }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
              <Badge 
                variant={
                  post.status === 'approved' ? 'default' : 
                  post.status === 'rejected' ? 'destructive' : 
                  'secondary'
                }
                className={post.status === 'approved' ? 'bg-success text-success-foreground' : ''}
              >
                {post.status}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {post.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {post.authorName}
              </span>
              {post.taggedMembers.length > 0 && (
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {post.taggedMembers.length} tagged
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {post.filters.map(filter => (
                <Badge key={filter} variant="outline" className="text-xs">
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
          
          {showActions && (
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openPreview(post)}
                className="w-full"
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              
              {post.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(post)}
                    className="w-full bg-success text-success-foreground hover:bg-success/90"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openRejectDialog(post)}
                    className="w-full"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </>
              )}
              
              {post.status === 'approved' && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openPDFPreview(post, 'landscape')}
                    title="Landscape PDF (for TV)"
                  >
                    <Monitor className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openPDFPreview(post, 'portrait')}
                    title="Portrait PDF (for display)"
                  >
                    <Smartphone className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Admin Review Panel
          </CardTitle>
          <CardDescription>
            Review, approve, or reject student posts. Download PDF versions for TV displays.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingPosts.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-accent text-accent-foreground rounded-full">
                    {pendingPosts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedPosts.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedPosts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingPosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending posts to review</p>
                </div>
              ) : (
                pendingPosts.map(post => <PostCard key={post.id} post={post} />)
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedPosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No approved posts yet</p>
                </div>
              ) : (
                approvedPosts.map(post => <PostCard key={post.id} post={post} />)
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedPosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <X className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No rejected posts</p>
                </div>
              ) : (
                rejectedPosts.map(post => (
                  <div key={post.id}>
                    <PostCard post={post} showActions={false} />
                    {post.rejectionReason && (
                      <div className="ml-4 mb-4 p-3 bg-destructive/10 border-l-4 border-destructive rounded-r text-sm">
                        <strong className="text-destructive">Reason:</strong> {post.rejectionReason}
                      </div>
                    )}
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Post Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Preview</DialogTitle>
            <DialogDescription>
              Preview how this post will appear on the website
            </DialogDescription>
          </DialogHeader>
          {selectedPost && <PostPreview post={selectedPost} />}
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog open={showPDFPreview} onOpenChange={setShowPDFPreview}>
        <DialogContent className={`${pdfOrientation === 'landscape' ? 'max-w-4xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              PDF Preview ({pdfOrientation === 'landscape' ? 'Landscape - TV Display' : 'Portrait - Vertical Display'})
            </DialogTitle>
            <DialogDescription>
              Preview the PDF version for TV screens
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <PDFPreview post={selectedPost} orientation={pdfOrientation} />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPDFPreview(false)}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Post</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this post. The student will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
