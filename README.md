# hevy-http-mcp

An HTTP Model Context Protocol (MCP) server for the [Hevy](https://www.hevyapp.com/) workout tracker API, built with [Elysia](https://elysiajs.com/), [elysia-mcp](https://github.com/kerlos/elysia-mcp), and [ofetch](https://github.com/unjs/ofetch).

Exposes all core Hevy API operations (workouts, routines, exercise templates, routine folders) as MCP tools over HTTP transport, so any MCP-compatible client can connect remotely — no stdio required.

## Prerequisites

- [Bun](https://bun.sh/) v1.0+
- A **Hevy Pro** account with an API key (get one at <https://hevy.com/settings?developer>)

## Quick Start

```bash
# Clone the repository
git clone <repo-url> hevy-http-mcp
cd hevy-http-mcp

# Install dependencies
bun install

# Create your .env from the example
cp .env.example .env
# Edit .env and fill in HEVY_API_KEY and MCP_API_KEY

# Start the server
bun run start
```

The MCP endpoint will be available at `http://localhost:3000/mcp`.

### Development mode (hot-reload)

```bash
bun run dev
```

### Inspector

```bash
bun run inspect
```

Opens the MCP Inspector UI pointed at the local server.

## Configuration

All configuration is done via environment variables (or a `.env` file).

| Variable | Required | Default | Description |
|---|---|---|---|
| `HEVY_API_KEY` | **Yes** | — | Your Hevy API key |
| `MCP_API_KEY` | **Yes** | — | A secret key clients must send to authenticate with this MCP server |
| `PORT` | No | `3000` | HTTP port |
| `LOG_LEVEL` | No | `info` | Logging verbosity (`debug`, `info`, `warn`, `error`) |

## Authentication

Every request to `/mcp` must include an `Authorization` header:

```
Authorization: Bearer <MCP_API_KEY>
```

Requests without a valid key receive **401** or **403** responses.

## MCP Client Configuration

### Cursor / Claude Desktop (Streamable HTTP)

```json
{
  "mcpServers": {
    "hevy": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Bearer <your-mcp-api-key>"
      }
    }
  }
}
```

## Available Tools

### Workouts

| Tool | Description |
|---|---|
| `get-workouts` | Paginated list of workouts |
| `get-workout` | Single workout by ID |
| `create-workout` | Create a new workout |
| `update-workout` | Update an existing workout |
| `get-workout-count` | Total number of workouts |
| `get-workout-events` | Workout update/delete events (paginated) |

### Routines

| Tool | Description |
|---|---|
| `get-routines` | Paginated list of routines |
| `get-routine-by-id` | Single routine by ID |
| `create-routine` | Create a new routine |
| `update-routine` | Update an existing routine |

### Exercise Templates

| Tool | Description |
|---|---|
| `get-exercise-templates` | Paginated list of exercise templates |
| `get-exercise-template` | Single template by ID |

### Routine Folders

| Tool | Description |
|---|---|
| `get-routine-folders` | Paginated list of folders |
| `create-routine-folder` | Create a new folder |
| `get-routine-folder` | Single folder by ID |

## Project Structure

```
hevy-http-mcp/
├── .env.example          # Environment variable template
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts           # Entry point — Elysia server + MCP plugin setup
    ├── config.ts          # Environment variable loading & validation
    ├── logger.ts          # Structured logger with levels
    ├── hevy/
    │   ├── index.ts       # Re-exports
    │   ├── client.ts      # Hevy API client (ofetch)
    │   └── types.ts       # TypeScript types for all Hevy API entities
    └── tools/
        ├── index.ts       # Re-exports all tool registrations
        ├── helpers.ts     # Shared MCP response builders + error wrapper
        ├── workouts.ts    # Workout tools
        ├── routines.ts    # Routine tools
        ├── templates.ts   # Exercise template tools
        └── folders.ts     # Routine folder tools
```

## Security

- **No secrets in code** — all credentials are loaded from environment variables.
- `.env` is gitignored; only `.env.example` (with placeholder values) is committed.
- MCP endpoint is protected by API key authentication; unauthenticated requests are rejected before reaching any tool handler.
- The Hevy API key is only sent server-side to `api.hevyapp.com` and is never exposed to MCP clients.

## License

MIT
