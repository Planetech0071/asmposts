// ASM Student Posts Types

export type PostStatus = 'pending' | 'approved' | 'rejected';

export type PostFilter = 
  | 'Club'
  | 'Student Council'
  | 'Sports'
  | 'Arts'
  | 'Music'
  | 'Community Service'
  | 'Academic'
  | 'Event';

export interface TaggedMember {
  fullName: string;
  role?: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  filters: PostFilter[];
  taggedMembers: TaggedMember[];
  images: string[];
  authorName: string;
  status: PostStatus;
  createdAt: string; // Changed to string to match Supabase timestamp
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'student' | 'admin';
  password: string; // In a real app, this would be hashed
}

// Demo users for the prototype
export const DEMO_USERS: User[] = [
  {
    id: 'student-001',
    username: 'student1',
    fullName: 'Marco Rossi',
    role: 'student',
    password: 'ASMstudent2024!'
  },
  {
    id: 'student-002',
    username: 'student2',
    fullName: 'Sofia Chen',
    role: 'student',
    password: 'ASMstudent2024!'
  },
  {
    id: 'admin-001',
    username: 'admin',
    fullName: 'Dr. Johnson',
    role: 'admin',
    password: 'ASMadmin2024!'
  }
];

export const FILTERS: PostFilter[] = [
  'Club',
  'Student Council',
  'Sports',
  'Arts',
  'Music',
  'Community Service',
  'Academic',
  'Event'
];

// Sample posts for demo
export const DEMO_POSTS: Post[] = [
  {
    id: 'post-001',
    title: 'Model UN Conference Success',
    description: 'Our ASM delegation represented Italy at the European Model UN conference in Geneva. Students debated topics ranging from climate change to international security.',
    filters: ['Club', 'Academic'],
    taggedMembers: [
      { fullName: 'Marco Rossi', role: 'Head Delegate' },
      { fullName: 'Emma Williams', role: 'Delegate' },
      { fullName: 'Luca Ferrari', role: 'Delegate' }
    ],
    images: ['/demo/mun-conference.jpg'],
    authorName: 'Marco Rossi',
    status: 'approved',
    createdAt: '2024-01-15T00:00:00.000Z',
    reviewedAt: '2024-01-16T00:00:00.000Z',
    reviewedBy: 'admin-001'
  },
  {
    id: 'post-002',
    title: 'Spring Concert Announcement',
    description: 'Join us for the annual Spring Concert featuring performances by the Orchestra, Choir, and Jazz Band. All families welcome!',
    filters: ['Music', 'Event'],
    taggedMembers: [
      { fullName: 'Sofia Chen', role: 'Orchestra Director' },
      { fullName: 'James Miller', role: 'Choir Lead' }
    ],
    images: ['/demo/spring-concert.jpg'],
    authorName: 'Sofia Chen',
    status: 'pending',
    createdAt: '2024-01-20T00:00:00.000Z'
  },
  {
    id: 'post-003',
    title: 'Basketball Team Wins Championship',
    description: 'Congratulations to our Varsity Basketball team for winning the ISST Championship! A historic victory for ASM athletics.',
    filters: ['Sports', 'Event'],
    taggedMembers: [
      { fullName: 'Andrea Bianchi', role: 'Team Captain' },
      { fullName: 'Michael Thompson', role: 'MVP' }
    ],
    images: ['/demo/basketball-win.jpg'],
    authorName: 'Marco Rossi',
    status: 'approved',
    createdAt: '2024-01-18T00:00:00.000Z',
    reviewedAt: '2024-01-18T00:00:00.000Z',
    reviewedBy: 'admin-001'
  }
];
