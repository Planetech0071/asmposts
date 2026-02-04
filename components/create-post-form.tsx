'use client';

import React from "react"

import { useState } from 'react';
import { Plus, X, Upload, ImageIcon, Users, Tag, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { FILTERS, PostFilter, TaggedMember } from '@/lib/types';

interface CreatePostFormProps {
  onSuccess: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<PostFilter[]>([]);
  const [taggedMembers, setTaggedMembers] = useState<TaggedMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { createPost, currentUser } = useAppStore();

  const toggleFilter = (filter: PostFilter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const addMember = () => {
    if (newMemberName.trim()) {
      setTaggedMembers(prev => [
        ...prev,
        { fullName: newMemberName.trim(), role: newMemberRole.trim() || undefined }
      ]);
      setNewMemberName('');
      setNewMemberRole('');
    }
  };

  const removeMember = (index: number) => {
    setTaggedMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSubmitting(true);

    try {
      await createPost({
        title,
        description,
        filters: selectedFilters,
        taggedMembers,
        images,
        authorName: currentUser.fullName
      });

      setShowSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setSelectedFilters([]);
        setTaggedMembers([]);
        setImages([]);
        setShowSuccess(false);
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Post Submitted!</h3>
          <p className="text-muted-foreground">
            Your post has been sent for admin review. You will be notified once it is approved.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Create New Post
        </CardTitle>
        <CardDescription>
          Fill in the details below to create a new student post. It will be sent for admin review before publishing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Post Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter a clear, descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Write a brief description of the event, activity, or announcement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">{description.length}/500 characters</p>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categories <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mb-2">Select one or more categories that apply to your post</p>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <Badge
                  key={filter}
                  variant={selectedFilters.includes(filter) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${
                    selectedFilters.includes(filter)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tagged Members */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tag Participants
            </Label>
            <p className="text-xs text-muted-foreground mb-2">Add the full names of students or staff involved</p>
            
            {/* Tagged members list */}
            {taggedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {taggedMembers.map((member, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1">
                    <span>{member.fullName}</span>
                    {member.role && <span className="text-muted-foreground">({member.role})</span>}
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="ml-1 hover:text-destructive"
                      aria-label={`Remove ${member.fullName}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Add member form */}
            <div className="flex gap-2">
              <Input
                placeholder="Full Name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Role (optional)"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="w-32"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addMember}
                disabled={!newMemberName.trim()}
                aria-label="Add member"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Images
            </Label>
            <p className="text-xs text-muted-foreground mb-2">Upload images for your post (optional)</p>
            
            {/* Image preview */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {images.map((image, index) => (
                  <div key={index} className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden group">
                    <img
                      src={image}
                      alt={`Upload preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload button */}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg hover:border-primary hover:bg-secondary/50 transition-colors">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload Images</span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Your post will be reviewed by an administrator before publishing.
            </p>
            <Button 
              type="submit" 
              disabled={!title || !description || selectedFilters.length === 0 || isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
