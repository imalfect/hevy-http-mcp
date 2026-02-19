/**
 * MCP tools for managing Hevy routine folders.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HevyClient } from "../hevy/client";
import type { Logger } from "../logger";
import { jsonContent, withErrorHandling } from "./helpers";

export function registerFolderTools(server: McpServer, client: HevyClient, logger: Logger): void {
  server.tool(
    "get-routine-folders",
    "Fetch a paginated list of routine folders",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      pageSize: z.number().optional().describe("Items per page (default: 5, max: 10)"),
    },
    async (args) =>
      withErrorHandling(logger, "get-routine-folders", async () => {
        const data = await client.getRoutineFolders(args.page, args.pageSize);
        return jsonContent(data);
      }),
  );

  server.tool(
    "create-routine-folder",
    "Create a new routine folder",
    {
      title: z.string().describe("Folder title"),
    },
    async (args) =>
      withErrorHandling(logger, "create-routine-folder", async () => {
        const data = await client.createRoutineFolder(args.title);
        return jsonContent(data);
      }),
  );

  server.tool(
    "get-routine-folder",
    "Get a single routine folder by its ID",
    {
      folderId: z.number().describe("The routine folder ID"),
    },
    async (args) =>
      withErrorHandling(logger, "get-routine-folder", async () => {
        const data = await client.getRoutineFolder(args.folderId);
        return jsonContent(data);
      }),
  );
}
