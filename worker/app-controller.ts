import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo } from './types';
import type { Env } from './core-utils';
export interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: number;
  updatedAt: number;
  authorId?: string;
  excerpt?: string;
}
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private posts = new Map<string, Post>();
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const [storedSessions, storedPosts] = await Promise.all([
        this.ctx.storage.get<Record<string, SessionInfo>>('sessions'),
        this.ctx.storage.get<Record<string, Post>>('posts')
      ]);
      this.sessions = new Map(Object.entries(storedSessions || {}));
      this.posts = new Map(Object.entries(storedPosts || {}));
      this.loaded = true;
    }
  }
  private async persist(): Promise<void> {
    await Promise.all([
      this.ctx.storage.put('sessions', Object.fromEntries(this.sessions)),
      this.ctx.storage.put('posts', Object.fromEntries(this.posts))
    ]);
  }
  // --- Session Management ---
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persist();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persist();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persist();
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = title;
      await this.persist();
      return true;
    }
    return false;
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  async getSessionCount(): Promise<number> {
    await this.ensureLoaded();
    return this.sessions.size;
  }
  // --- CMS Content Management ---
  async listPosts(): Promise<Post[]> {
    await this.ensureLoaded();
    return Array.from(this.posts.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }
  async getPost(id: string): Promise<Post | null> {
    await this.ensureLoaded();
    return this.posts.get(id) || null;
  }
  async createPost(post: Partial<Post>): Promise<Post> {
    await this.ensureLoaded();
    const id = post.id || crypto.randomUUID();
    const now = Date.now();
    const newPost: Post = {
      id,
      title: post.title || 'Untitled Post',
      content: post.content || '',
      status: post.status || 'draft',
      createdAt: now,
      updatedAt: now,
      authorId: post.authorId,
      excerpt: post.excerpt || ''
    };
    this.posts.set(id, newPost);
    await this.persist();
    return newPost;
  }
  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    await this.ensureLoaded();
    const post = this.posts.get(id);
    if (!post) return null;
    const updatedPost: Post = {
      ...post,
      ...updates,
      updatedAt: Date.now()
    };
    this.posts.set(id, updatedPost);
    await this.persist();
    return updatedPost;
  }
  async deletePost(id: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.posts.delete(id);
    if (deleted) await this.persist();
    return deleted;
  }
  async clearAllSessions(): Promise<number> {
    await this.ensureLoaded();
    const count = this.sessions.size;
    this.sessions.clear();
    await this.persist();
    return count;
  }
}