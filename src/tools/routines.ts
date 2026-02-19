/**
 * MCP tools for managing Hevy routines.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HevyClient } from "../hevy/client";
import type { Logger } from "../logger";
import { jsonContent, withErrorHandling } from "./helpers";

const routineSetSchema = z.object({
  type: z.enum(["normal", "warmup", "dropset", "failure"]).describe("Set type"),
  weight_kg: z.number().nullable().optional().describe("Weight in kg"),
  reps: z.number().nullable().optional().describe("Number of reps"),
  distance_meters: z.number().nullable().optional().describe("Distance in meters"),
  duration_seconds: z.number().nullable().optional().describe("Duration in seconds"),
  custom_metric: z.number().nullable().optional().describe("Custom metric value"),
  rep_range: z
    .object({
      start: z.number().describe("Start of rep range"),
      end: z.number().describe("End of rep range"),
    })
    .nullable()
    .optional()
    .describe("Target rep range"),
});

const routineExerciseSchema = z.object({
  exercise_template_id: z.string().describe("Exercise template ID"),
  superset_id: z.number().nullable().optional().describe("Superset group ID"),
  rest_seconds: z.number().nullable().optional().describe("Rest time between sets in seconds"),
  notes: z.string().nullable().optional().describe("Exercise notes"),
  sets: z.array(routineSetSchema).describe("Array of sets"),
});

export function registerRoutineTools(server: McpServer, client: HevyClient, logger: Logger): void {
  server.tool(
    "get-routines",
    "Fetch a paginated list of routines",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      pageSize: z.number().optional().describe("Items per page (default: 5, max: 10)"),
    },
    async (args) =>
      withErrorHandling(logger, "get-routines", async () => {
        const data = await client.getRoutines(args.page, args.pageSize);
        return jsonContent(data);
      }),
  );

  server.tool(
    "get-routine-by-id",
    "Get a single routine by its ID",
    {
      routineId: z.string().describe("The routine ID"),
    },
    async (args) =>
      withErrorHandling(logger, "get-routine-by-id", async () => {
        const data = await client.getRoutineById(args.routineId);
        return jsonContent(data);
      }),
  );

  server.tool(
    "create-routine",
    "Create a new routine",
    {
      title: z.string().describe("Routine title"),
      folder_id: z.number().nullable().optional().describe("Folder ID to place routine in"),
      notes: z.string().nullable().optional().describe("Routine notes"),
      exercises: z.array(routineExerciseSchema).describe("Array of exercises in the routine"),
    },
    async (args) =>
      withErrorHandling(logger, "create-routine", async () => {
        const data = await client.createRoutine({
          title: args.title,
          folder_id: args.folder_id,
          notes: args.notes,
          exercises: args.exercises,
        });
        return jsonContent(data);
      }),
  );

  server.tool(
    "update-routine",
    "Update an existing routine by its ID",
    {
      routineId: z.string().describe("The routine ID to update"),
      title: z.string().describe("Updated routine title"),
      notes: z.string().nullable().optional().describe("Updated routine notes"),
      exercises: z.array(routineExerciseSchema).describe("Updated exercises"),
    },
    async (args) =>
      withErrorHandling(logger, "update-routine", async () => {
        const data = await client.updateRoutine(args.routineId, {
          title: args.title,
          notes: args.notes,
          exercises: args.exercises,
        });
        return jsonContent(data);
      }),
  );
}
