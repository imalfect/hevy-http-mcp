/**
 * Hevy API client built with ofetch.
 * All methods are typed and handle errors consistently.
 */

import { ofetch, type FetchOptions } from "ofetch";
import type { Logger } from "../logger";
import type {
  PaginatedWorkouts,
  Workout,
  WorkoutInput,
  WorkoutCountResponse,
  PaginatedWorkoutEvents,
  PaginatedRoutines,
  Routine,
  RoutineCreateInput,
  RoutineUpdateInput,
  PaginatedExerciseTemplates,
  ExerciseTemplate,
  PaginatedRoutineFolders,
  RoutineFolder,
} from "./types";

const HEVY_BASE_URL = "https://api.hevyapp.com";

export class HevyClient {
  private readonly fetch: typeof ofetch;

  constructor(
    private readonly apiKey: string,
    private readonly logger: Logger,
  ) {
    this.fetch = ofetch.create({
      baseURL: HEVY_BASE_URL,
      headers: {
        "api-key": this.apiKey,
        Accept: "application/json",
      },
      onRequest: ({ request, options }) => {
        this.logger.debug(`[hevy] ${options.method ?? "GET"} ${String(request)}`);
      },
      onResponseError: ({ request, response }) => {
        this.logger.error(
          `[hevy] ${response.status} ${response.statusText} for ${String(request)}`,
          response._data,
        );
      },
    });
  }

  // ── Workouts ────────────────────────────────────────────────────────

  async getWorkouts(page = 1, pageSize = 5): Promise<PaginatedWorkouts> {
    return this.fetch<PaginatedWorkouts>("/v1/workouts", {
      query: { page, pageSize },
    });
  }

  async getWorkout(workoutId: string): Promise<Workout> {
    return this.fetch<Workout>(`/v1/workouts/${workoutId}`);
  }

  async createWorkout(workout: WorkoutInput): Promise<Workout> {
    return this.fetch<Workout>("/v1/workouts", {
      method: "POST",
      body: { workout },
    });
  }

  async updateWorkout(workoutId: string, workout: WorkoutInput): Promise<Workout> {
    return this.fetch<Workout>(`/v1/workouts/${workoutId}`, {
      method: "PUT",
      body: { workout },
    });
  }

  async getWorkoutCount(): Promise<WorkoutCountResponse> {
    return this.fetch<WorkoutCountResponse>("/v1/workouts/count");
  }

  async getWorkoutEvents(
    page = 1,
    pageSize = 5,
    since?: string,
  ): Promise<PaginatedWorkoutEvents> {
    const query: Record<string, unknown> = { page, pageSize };
    if (since) query.since = since;
    return this.fetch<PaginatedWorkoutEvents>("/v1/workouts/events", { query });
  }

  // ── Routines ────────────────────────────────────────────────────────

  async getRoutines(page = 1, pageSize = 5): Promise<PaginatedRoutines> {
    return this.fetch<PaginatedRoutines>("/v1/routines", {
      query: { page, pageSize },
    });
  }

  async getRoutineById(routineId: string): Promise<{ routine: Routine }> {
    return this.fetch<{ routine: Routine }>(`/v1/routines/${routineId}`);
  }

  async createRoutine(routine: RoutineCreateInput): Promise<Routine> {
    return this.fetch<Routine>("/v1/routines", {
      method: "POST",
      body: { routine },
    });
  }

  async updateRoutine(routineId: string, routine: RoutineUpdateInput): Promise<Routine> {
    return this.fetch<Routine>(`/v1/routines/${routineId}`, {
      method: "PUT",
      body: { routine },
    });
  }

  // ── Exercise Templates ──────────────────────────────────────────────

  async getExerciseTemplates(
    page = 1,
    pageSize = 10,
  ): Promise<PaginatedExerciseTemplates> {
    return this.fetch<PaginatedExerciseTemplates>("/v1/exercise_templates", {
      query: { page, pageSize },
    });
  }

  async getExerciseTemplate(templateId: string): Promise<ExerciseTemplate> {
    return this.fetch<ExerciseTemplate>(`/v1/exercise_templates/${templateId}`);
  }

  // ── Routine Folders ─────────────────────────────────────────────────

  async getRoutineFolders(page = 1, pageSize = 5): Promise<PaginatedRoutineFolders> {
    return this.fetch<PaginatedRoutineFolders>("/v1/routine_folders", {
      query: { page, pageSize },
    });
  }

  async createRoutineFolder(title: string): Promise<RoutineFolder> {
    return this.fetch<RoutineFolder>("/v1/routine_folders", {
      method: "POST",
      body: { routine_folder: { title } },
    });
  }

  async getRoutineFolder(folderId: number): Promise<RoutineFolder> {
    return this.fetch<RoutineFolder>(`/v1/routine_folders/${folderId}`);
  }
}
