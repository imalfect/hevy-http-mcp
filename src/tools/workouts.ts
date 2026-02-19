/**
 * MCP tools for managing Hevy workouts.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HevyClient } from "../hevy/client";
import type { Logger } from "../logger";
import { jsonContent, withErrorHandling } from "./helpers";

const setSchema = z.object({
  type: z.enum(["normal", "warmup", "dropset", "failure"]).describe("Set type"),
  weight_kg: z.number().nullable().optional().describe("Weight in kg"),
  reps: z.number().nullable().optional().describe("Number of reps"),
  distance_meters: z.number().nullable().optional().describe("Distance in meters"),
  duration_seconds: z.number().nullable().optional().describe("Duration in seconds"),
  rpe: z
    .union([z.literal(6), z.literal(7), z.literal(7.5), z.literal(8), z.literal(8.5), z.literal(9), z.literal(9.5), z.literal(10)])
    .nullable()
    .optional()
    .describe("Rate of perceived exertion (6-10)"),
  custom_metric: z.number().nullable().optional().describe("Custom metric value"),
});

const exerciseSchema = z.object({
  exercise_template_id: z.string().describe("Exercise template ID"),
  superset_id: z.number().nullable().optional().describe("Superset group ID"),
  notes: z.string().nullable().optional().describe("Exercise notes"),
  sets: z.array(setSchema).describe("Array of sets"),
});

const workoutInputSchema = z.object({
  title: z.string().describe("Workout title"),
  description: z.string().nullable().optional().describe("Workout description"),
  start_time: z.string().describe("Start time (ISO 8601)"),
  end_time: z.string().describe("End time (ISO 8601)"),
  is_private: z.boolean().optional().describe("Whether the workout is private"),
  exercises: z.array(exerciseSchema).describe("Array of exercises"),
});

export function registerWorkoutTools(server: McpServer, client: HevyClient, logger: Logger): void {
  server.tool(
    "get-workouts",
    "Fetch a paginated list of workouts",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      pageSize: z.number().optional().describe("Items per page (default: 5, max: 10)"),
    },
    async (args) =>
      withErrorHandling(logger, "get-workouts", async () => {
        const data = await client.getWorkouts(args.page, args.pageSize);
        return jsonContent(data);
      }),
  );

  server.tool(
    "get-workout",
    "Get a single workout by its ID",
    {
      workoutId: z.string().describe("The workout ID"),
    },
    async (args) =>
      withErrorHandling(logger, "get-workout", async () => {
        const data = await client.getWorkout(args.workoutId);
        return jsonContent(data);
      }),
  );

  server.tool(
    "create-workout",
    "Create a new workout",
    {
      workout: workoutInputSchema.describe("Workout data to create"),
    },
    async (args) =>
      withErrorHandling(logger, "create-workout", async () => {
        const data = await client.createWorkout(args.workout);
        return jsonContent(data);
      }),
  );

  server.tool(
    "update-workout",
    "Update an existing workout by its ID",
    {
      workoutId: z.string().describe("The workout ID to update"),
      workout: workoutInputSchema.describe("Updated workout data"),
    },
    async (args) =>
      withErrorHandling(logger, "update-workout", async () => {
        const data = await client.updateWorkout(args.workoutId, args.workout);
        return jsonContent(data);
      }),
  );

  server.tool(
    "get-workout-count",
    "Get the total number of workouts",
    {},
    async () =>
      withErrorHandling(logger, "get-workout-count", async () => {
        const data = await client.getWorkoutCount();
        return jsonContent(data);
      }),
  );

  server.tool(
    "get-workout-events",
    "Get paginated workout update/delete events",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      pageSize: z.number().optional().describe("Items per page (default: 5, max: 10)"),
      since: z.string().optional().describe("ISO 8601 timestamp to filter events since"),
    },
    async (args) =>
      withErrorHandling(logger, "get-workout-events", async () => {
        const data = await client.getWorkoutEvents(args.page, args.pageSize, args.since);
        return jsonContent(data);
      }),
  );
}
