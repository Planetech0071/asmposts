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
    return (
      <div className="bg-white text-black p-8" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}>
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">{post.title}</h1>

        {/* Images */}
        {post.images.length > 0 && (
          <div className="mb-6">
            {post.images.map((image, index) => (
              <div key={index} className="mb-4">
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="max-w-full h-auto"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-base leading-relaxed mb-6 whitespace-pre-wrap">{post.description}</p>

        {/* Tagged Members */}
        {post.taggedMembers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Participants:</h3>
            <ul className="list-disc list-inside">
              {post.taggedMembers.map((member, index) => (
                <li key={index} className="text-base">
                  {member.fullName}
                  {member.role && ` (${member.role})`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Filters/Tags */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Categories:</h3>
          <div className="flex flex-wrap gap-2">
            {post.filters.map(filter => (
              <span key={filter} className="text-sm bg-gray-200 px-3 py-1 rounded">
                {filter}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 text-sm text-gray-600 border-t border-gray-300">
          <p>Posted by {post.authorName} on {formatDate(post.createdAt)}</p>
          <p>American School of Milan - Student Posts</p>
        </div>
      </div>
    );
  }

  // Landscape
  return (
    <div className="bg-white text-black p-8" style={{ width: '297mm', minHeight: '210mm', fontFamily: 'Arial, sans-serif' }}>
      <div className="grid grid-cols-2 gap-8 h-full">
        {/* Left Column */}
        <div>
          {/* Title */}
          <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

          {/* Description */}
          <p className="text-base leading-relaxed mb-6 whitespace-pre-wrap">{post.description}</p>

          {/* Tagged Members */}
          {post.taggedMembers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Participants:</h3>
              <ul className="list-disc list-inside">
                {post.taggedMembers.map((member, index) => (
                  <li key={index} className="text-base">
                    {member.fullName}
                    {member.role && ` (${member.role})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filters/Tags */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Categories:</h3>
            <div className="flex flex-wrap gap-2">
              {post.filters.map(filter => (
                <span key={filter} className="text-sm bg-gray-200 px-3 py-1 rounded">
                  {filter}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 text-sm text-gray-600 border-t border-gray-300">
            <p>Posted by {post.authorName} on {formatDate(post.createdAt)}</p>
            <p>American School of Milan - Student Posts</p>
          </div>
        </div>

        {/* Right Column - Images */}
        <div className="flex flex-col justify-center">
          {post.images.length > 0 ? (
            <div className="space-y-4">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-auto max-h-48 object-contain"
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p>No images</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
