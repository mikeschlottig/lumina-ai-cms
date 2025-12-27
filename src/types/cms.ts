export type PostStatus = 'draft' | 'published' | 'archived';
export interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  createdAt: number;
  updatedAt: number;
  authorId?: string;
  excerpt?: string;
}
export interface CMSStats {
  total: number;
  published: number;
  drafts: number;
}