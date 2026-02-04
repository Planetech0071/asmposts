import { createClient } from './client';
import { Post, PostStatus } from '../types';

export async function getPosts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  // Transform the data to match our Post interface
  return data.map(post => ({
    id: post.id,
    title: post.title,
    description: post.description,
    filters: post.filters,
    taggedMembers: post.tagged_members,
    images: post.images,
    authorName: post.author_name,
    status: post.status as PostStatus,
    createdAt: post.created_at,
    reviewedAt: post.reviewed_at,
    reviewedBy: post.reviewed_by,
    rejectionReason: post.rejection_reason,
  })) as Post[];
}

export async function createPost(postData: {
  title: string;
  description: string;
  filters: string[];
  taggedMembers: any[];
  images: string[];
  authorName: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      title: postData.title,
      description: postData.description,
      filters: postData.filters,
      tagged_members: postData.taggedMembers,
      images: postData.images,
      author_name: postData.authorName,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }

  return data;
}

export async function updatePostStatus(
  postId: string,
  status: PostStatus,
  reviewedBy: string,
  rejectionReason?: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
      rejection_reason: rejectionReason,
    })
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    console.error('Error updating post status:', error);
    throw error;
  }

  return data;
}