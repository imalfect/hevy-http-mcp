/**
 * Application configuration loaded from environment variables.
 */

export interface Config {
  /** Hevy API key for authenticating with the Hevy API */
  hevyApiKey: string;
  /** API key required by clients to access this MCP server */
  mcpApiKey: string;
  /** Port to run the server on */
  port: number;
  /** Hostname to bind to (default: 0.0.0.0) */
  host: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[config] Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export function loadConfig(): Config {
  return {
    hevyApiKey: requireEnv("HEVY_API_KEY"),
    mcpApiKey: requireEnv("MCP_API_KEY"),
    port: parseInt(process.env["PORT"] ?? "3000", 10),
    host: process.env["HOST"] ?? "127.0.0.1",
  };
}
