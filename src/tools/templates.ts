/**
 * MCP tools for browsing Hevy exercise templates.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HevyClient } from "../hevy/client";
import type { Logger } from "../logger";
import { jsonContent, withErrorHandling } from "./helpers";

export function registerTemplateTools(server: McpServer, client: HevyClient, logger: Logger): void {
  server.tool(
    "get-exercise-templates",
    "Fetch a paginated list of exercise templates",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      pageSize: z.number().optional().describe("Items per page (default: 10, max: 100)"),
    },
    async (args) =>
      withErrorHandling(logger, "get-exercise-templates", async () => {
        const data = await client.getExerciseTemplates(args.page, args.pageSize);
        return jsonContent(data);
      }),
  );

  server.tool(
    "get-exercise-template",
    "Get a single exercise template by its ID",
    {
      templateId: z.string().describe("The exercise template ID"),
    },
    async (args) =>
      withErrorHandling(logger, "get-exercise-template", async () => {
        const data = await client.getExerciseTemplate(args.templateId);
        return jsonContent(data);
      }),
  );
}
