import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({ success: false, error: API_RESPONSES.AGENT_ROUTING_FAILED }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Session Routes
    app.get('/api/sessions', async (c) => {
        const controller = getAppController(c.env);
        return c.json({ success: true, data: await controller.listSessions() });
    });
    app.post('/api/sessions', async (c) => {
        const body = await c.req.json().catch(() => ({}));
        const { title, sessionId: providedSessionId, firstMessage } = body;
        const sessionId = providedSessionId || crypto.randomUUID();
        let sessionTitle = title || `Chat ${new Date().toLocaleDateString()}`;
        await registerSession(c.env, sessionId, sessionTitle);
        return c.json({ success: true, data: { sessionId, title: sessionTitle } });
    });
    // CMS Routes
    app.get('/api/cms/posts', async (c) => {
        const controller = getAppController(c.env);
        const posts = await controller.listPosts();
        return c.json({ success: true, data: posts });
    });
    app.get('/api/cms/posts/:id', async (c) => {
        const controller = getAppController(c.env);
        const post = await controller.getPost(c.req.param('id'));
        if (!post) return c.json({ success: false, error: 'Post not found' }, 404);
        return c.json({ success: true, data: post });
    });
    app.post('/api/cms/posts', async (c) => {
        const controller = getAppController(c.env);
        const body = await c.req.json();
        const post = await controller.createPost(body);
        return c.json({ success: true, data: post });
    });
    app.put('/api/cms/posts/:id', async (c) => {
        const controller = getAppController(c.env);
        const body = await c.req.json();
        const post = await controller.updatePost(c.req.param('id'), body);
        if (!post) return c.json({ success: false, error: 'Post not found' }, 404);
        return c.json({ success: true, data: post });
    });
    app.delete('/api/cms/posts/:id', async (c) => {
        const controller = getAppController(c.env);
        const deleted = await controller.deletePost(c.req.param('id'));
        return c.json({ success: true, data: { deleted } });
    });
}