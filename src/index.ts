/**
 * hevy-http-mcp — HTTP MCP server for the Hevy workout tracker API.
 *
 * Entry point: configures Elysia, the MCP plugin, authentication,
 * and registers all Hevy tools.
 */

import { Elysia } from "elysia";
import { mcp } from "elysia-mcp";

import { loadConfig } from "./config";
import { createLogger } from "./logger";
import { HevyClient } from "./hevy/client";
import {
  registerWorkoutTools,
  registerRoutineTools,
  registerTemplateTools,
  registerFolderTools,
} from "./tools";

// ── Bootstrap ───────────────────────────────────────────────────────────

const config = loadConfig();
const logger = createLogger(
  (process.env["LOG_LEVEL"] as "debug" | "info" | "warn" | "error") ?? "info",
);
const hevy = new HevyClient(config.hevyApiKey, logger);

logger.info("Starting hevy-http-mcp server…");

// ── Elysia App ──────────────────────────────────────────────────────────

const app = new Elysia()
  .use(
    mcp({
      basePath: "/mcp",
      serverInfo: {
        name: "hevy-http-mcp",
        version: "1.0.0",
      },
      capabilities: {
        tools: {},
      },
      enableLogging: true,
      authentication: async (ctx) => {
        const authHeader =
          ctx.request.headers.get("Authorization") ??
          ctx.request.headers.get("authorization");

        if (!authHeader) {
          return {
            response: new Response(
              JSON.stringify({ error: "Missing Authorization header" }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            ),
          };
        }

        // Accept "Bearer <key>" or just the raw key
        const token = authHeader.startsWith("Bearer ")
          ? authHeader.slice(7)
          : authHeader;

        if (token !== config.mcpApiKey) {
          return {
            response: new Response(
              JSON.stringify({ error: "Invalid API key" }),
              { status: 403, headers: { "Content-Type": "application/json" } },
            ),
          };
        }

        return {
          authInfo: {
            token,
            clientId: "mcp-client",
            scopes: ["hevy:read", "hevy:write"],
          },
        };
      },
      setupServer: (server) => {
        registerWorkoutTools(server, hevy, logger);
        registerRoutineTools(server, hevy, logger);
        registerTemplateTools(server, hevy, logger);
        registerFolderTools(server, hevy, logger);
        logger.info("All Hevy MCP tools registered");
      },
    }),
  )
  .listen({ port: config.port, hostname: config.host });

logger.info(`hevy-http-mcp listening on http://${config.host}:${config.port}/mcp`);
