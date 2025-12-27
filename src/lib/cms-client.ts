import { Post } from '@/types/cms';
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
class CMSClient {
  private baseUrl = '/api/cms';
  async listPosts(): Promise<ApiResponse<Post[]>> {
    const res = await fetch(`${this.baseUrl}/posts`);
    return res.json();
  }
  async getPost(id: string): Promise<ApiResponse<Post>> {
    const res = await fetch(`${this.baseUrl}/posts/${id}`);
    return res.json();
  }
  async createPost(post: Partial<Post>): Promise<ApiResponse<Post>> {
    const res = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    return res.json();
  }
  async updatePost(id: string, updates: Partial<Post>): Promise<ApiResponse<Post>> {
    const res = await fetch(`${this.baseUrl}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  }
  async deletePost(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const res = await fetch(`${this.baseUrl}/posts/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  }
}
export const cmsClient = new CMSClient();