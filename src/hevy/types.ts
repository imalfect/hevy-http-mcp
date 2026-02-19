/**
 * TypeScript type definitions for the Hevy API v1.
 * Based on the official OpenAPI specification at https://api.hevyapp.com/docs/
 */

// ── Sets ────────────────────────────────────────────────────────────────

export type SetType = "normal" | "warmup" | "dropset" | "failure";

export interface WorkoutSet {
  index: number;
  type: SetType;
  weight_kg: number | null;
  reps: number | null;
  distance_meters: number | null;
  duration_seconds: number | null;
  rpe: number | null;
  custom_metric: number | null;
}

export interface SetInput {
  type: SetType;
  weight_kg?: number | null;
  reps?: number | null;
  distance_meters?: number | null;
  duration_seconds?: number | null;
  rpe?: 6 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10 | null;
  custom_metric?: number | null;
}

// ── Exercises ───────────────────────────────────────────────────────────

export interface WorkoutExercise {
  index: number;
  title: string;
  notes: string;
  exercise_template_id: string;
  supersets_id: number | null;
  sets: WorkoutSet[];
}

export interface ExerciseInput {
  exercise_template_id: string;
  superset_id?: number | null;
  notes?: string | null;
  sets: SetInput[];
}

// ── Workouts ────────────────────────────────────────────────────────────

export interface Workout {
  id: string;
  title: string;
  routine_id: string;
  description: string;
  start_time: string;
  end_time: string;
  updated_at: string;
  created_at: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutInput {
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  is_private?: boolean;
  exercises: ExerciseInput[];
}

export interface PaginatedWorkouts {
  page: number;
  page_count: number;
  workouts: Workout[];
}

export interface WorkoutCountResponse {
  workout_count: number;
}

// ── Workout Events ──────────────────────────────────────────────────────

export interface UpdatedWorkoutEvent {
  type: "updated";
  workout: Workout;
}

export interface DeletedWorkoutEvent {
  type: "deleted";
  id: string;
  deleted_at: string;
}

export type WorkoutEvent = UpdatedWorkoutEvent | DeletedWorkoutEvent;

export interface PaginatedWorkoutEvents {
  page: number;
  page_count: number;
  events: WorkoutEvent[];
}

// ── Routines ────────────────────────────────────────────────────────────

export interface RoutineSetInput {
  type: SetType;
  weight_kg?: number | null;
  reps?: number | null;
  distance_meters?: number | null;
  duration_seconds?: number | null;
  custom_metric?: number | null;
  rep_range?: { start: number; end: number } | null;
}

export interface RoutineSet extends RoutineSetInput {
  index: number;
  rpe: number | null;
}

export interface RoutineExercise {
  index: number;
  title: string;
  rest_seconds: string;
  notes: string;
  exercise_template_id: string;
  supersets_id: number | null;
  sets: RoutineSet[];
}

export interface RoutineExerciseInput {
  exercise_template_id: string;
  superset_id?: number | null;
  rest_seconds?: number | null;
  notes?: string | null;
  sets: RoutineSetInput[];
}

export interface Routine {
  id: string;
  title: string;
  folder_id: number | null;
  updated_at: string;
  created_at: string;
  exercises: RoutineExercise[];
}

export interface RoutineCreateInput {
  title: string;
  folder_id?: number | null;
  notes?: string | null;
  exercises: RoutineExerciseInput[];
}

export interface RoutineUpdateInput {
  title: string;
  notes?: string | null;
  exercises: RoutineExerciseInput[];
}

export interface PaginatedRoutines {
  page: number;
  page_count: number;
  routines: Routine[];
}

// ── Exercise Templates ──────────────────────────────────────────────────

export interface ExerciseTemplate {
  id: string;
  title: string;
  type: string;
  primary_muscle_group: string;
  secondary_muscle_groups: string[];
  is_custom: boolean;
}

export interface PaginatedExerciseTemplates {
  page: number;
  page_count: number;
  exercise_templates: ExerciseTemplate[];
}

// ── Routine Folders ─────────────────────────────────────────────────────

export interface RoutineFolder {
  id: number;
  index: number;
  title: string;
  updated_at: string;
  created_at: string;
}

export interface PaginatedRoutineFolders {
  page: number;
  page_count: number;
  routine_folders: RoutineFolder[];
}

// ── Hevy API Error ──────────────────────────────────────────────────────

export interface HevyApiError {
  error: string;
}
