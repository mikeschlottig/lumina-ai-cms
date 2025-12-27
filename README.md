# Cloudflare Workers AI Chat Agent

[![[cloudflarebutton]]](https://workers.cloudflare.com)

A production-ready Cloudflare Workers template for building stateful AI chat applications. Features per-session Durable Object agents, Cloudflare AI Gateway integration, tool calling, and a modern React UI with session management.

## 🚀 Features

- **Stateful Chat Agents**: Each conversation runs in its own Durable Object for isolation and persistence
- **Session Management**: Create, list, delete, and title sessions with activity tracking
- **AI Integration**: Seamless Cloudflare Workers AI Gateway support (Gemini models by default)
- **Tool Calling**: Built-in tools (weather, web search) + extensible MCP server integration
- **Streaming Responses**: Real-time streaming with fallback to non-streaming
- **Modern UI**: React 18 + Vite + shadcn/ui + Tailwind CSS + Lucide icons
- **TypeScript**: Fully typed with excellent DX
- **Production-Ready**: Error handling, logging, CORS, health checks, client error reporting

## 🛠 Tech Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects, Agents SDK
- **AI**: Cloudflare Workers AI Gateway, OpenAI-compatible API
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **State**: TanStack Query, Zustand, Immer
- **Tools**: SerpAPI web search, MCP (Model Context Protocol) support
- **Dev Tools**: Bun, wrangler, ESLint, Tailwind

## ⚡ Quick Start

1. **Clone & Install**:
   ```bash
   git clone <your-repo>
   cd your-project
   bun install
   ```

2. **Configure Environment** (edit `wrangler.jsonc`):
   ```json
   "vars": {
     "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai",
     "CF_AI_API_KEY": "{your_ai_gateway_token}",
     "SERPAPI_KEY": "{your_serpapi_key}"
   }
   ```

3. **Development**:
   ```bash
   bun run dev
   ```
   Open `http://localhost:8787` (or your configured port).

4. **Deploy**:
   ```bash
   bun run deploy
   ```

## 📦 Installation

This project uses **Bun** for fast installs and builds.

```bash
# Install dependencies
bun install

# Generate Cloudflare types
bun run cf-typegen
```

### Environment Variables

Set these in `wrangler.jsonc` under `vars` or as Worker secrets:

| Variable | Required | Description |
|----------|----------|-------------|
| `CF_AI_BASE_URL` | ✅ | Cloudflare AI Gateway OpenAI URL |
| `CF_AI_API_KEY` | ✅ | AI Gateway token |
| `SERPAPI_KEY` | ❌ | SerpAPI key for web search |
| `OPENROUTER_API_KEY` | ❌ | OpenRouter API key (unused in base template) |

## 💻 Usage

### Chat Sessions API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sessions` | GET | List all sessions |
| `/api/sessions` | POST | Create new session `{ title?, sessionId?, firstMessage? }` |
| `/api/sessions/:id` | DELETE | Delete session |
| `/api/sessions/:id/title` | PUT | Update title `{ title }` |
| `/api/sessions/stats` | GET | Session count |
| `/api/sessions` | DELETE | Clear all sessions |
| `/api/chat/:sessionId/chat` | POST | Send message `{ message, model?, stream? }` |
| `/api/chat/:sessionId/messages` | GET | Get chat state |
| `/api/chat/:sessionId/clear` | DELETE | Clear messages |
| `/api/chat/:sessionId/model` | POST | Update model `{ model }` |

### Frontend

- New chat: Creates session automatically
- Switch sessions: Via sidebar or API
- Streaming: Real-time responses
- Model selection: Gemini 2.5 Flash/Pro
- Theme toggle: Light/Dark mode

## 🔧 Development

```bash
# Dev server (Workers + Vite)
bun run dev

# Type check
bun run typecheck

# Lint
bun run lint

# Build for preview
bun run build

# Preview production build
bun run preview

# Deploy
bun run deploy
```

### Project Structure

```
├── worker/          # Cloudflare Worker (Hono API + Agents)
├── src/             # React frontend (Vite)
├── shared/          # Shared types/utils (optional)
└── wrangler.jsonc   # Worker config
```

**Extending**:
- Add routes: `worker/userRoutes.ts`
- Custom agents: Extend `ChatAgent`
- New tools: `worker/tools.ts`
- UI components: `src/components/ui/`
- MCP servers: `worker/mcp-client.ts`

## ☁️ Deployment

Deploy to Cloudflare Workers in seconds:

1. **Configure** `wrangler.jsonc` with your secrets
2. **Login**: `wrangler login`
3. **Deploy**:
   ```bash
   bun run deploy
   ```

[![[cloudflarebutton]]](https://workers.cloudflare.com)

**Custom Domain**: Update `wrangler.toml` with `route` or use Cloudflare Pages for SPA.

**SQLite Migration**: Automatic via `migrations` in `wrangler.jsonc`.

## 🤝 Contributing

1. Fork & clone
2. `bun install`
3. Create feature branch
4. `bun run dev` for testing
5. PR with clear description

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- Questions? Open an issue.

Built with ❤️ for the Cloudflare developer community.