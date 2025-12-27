import { Post } from '@/types/cms';
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface MediaAsset {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  size: string;
  dimensions?: string;
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
  // Mock Media API
  async getMediaQuery(): Promise<ApiResponse<MediaAsset[]>> {
    return {
      success: true,
      data: [
        { id: '1', name: 'Neural Network', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', type: 'image', size: '1.2MB', dimensions: '1920x1080' },
        { id: '2', name: 'Digital Garden', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', type: 'image', size: '800KB', dimensions: '1200x800' },
        { id: '3', name: 'Abstract Flow', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80', type: 'image', size: '2.1MB', dimensions: '2400x1600' },
        { id: '4', name: 'Deep Tech', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', type: 'image', size: '1.5MB', dimensions: '1920x1200' },
      ]
    };
  }
  // Mock Analytics API
  async getAnalyticsData(): Promise<ApiResponse<any>> {
    return {
      success: true,
      data: {
        engagement: [
          { day: 'Mon', views: 400, clicks: 240 },
          { day: 'Tue', views: 300, clicks: 139 },
          { day: 'Wed', views: 200, clicks: 980 },
          { day: 'Thu', views: 278, clicks: 390 },
          { day: 'Fri', views: 189, clicks: 480 },
          { day: 'Sat', views: 239, clicks: 380 },
          { day: 'Sun', views: 349, clicks: 430 },
        ]
      }
    };
  }
}
export const cmsClient = new CMSClient();