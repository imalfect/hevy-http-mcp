/**
 * Shared utility for building MCP tool responses and handling errors.
 */

import type { FetchError } from "ofetch";
import type { Logger } from "../logger";

/** Standard MCP text content response */
export function textContent(text: string) {
  return {
    content: [{ type: "text" as const, text }],
  };
}

/** Format an object as a pretty-printed JSON MCP response */
export function jsonContent(data: unknown) {
  return textContent(JSON.stringify(data, null, 2));
}

/**
 * Wrap an async tool handler with consistent error handling.
 * Catches ofetch errors and returns a formatted error response
 * instead of crashing the MCP server.
 */
export function withErrorHandling(
  logger: Logger,
  toolName: string,
  handler: () => Promise<{ content: { type: "text"; text: string }[] }>,
) {
  return handler().catch((err: unknown) => {
    const fetchErr = err as FetchError | undefined;
    const status = fetchErr?.response?.status;
    const body = fetchErr?.data;

    const message =
      body && typeof body === "object" && "error" in body
        ? (body as { error: string }).error
        : fetchErr?.message ?? String(err);

    logger.error(`[${toolName}] Error${status ? ` (${status})` : ""}: ${message}`);

    return textContent(`Error: ${message}`);
  });
}
