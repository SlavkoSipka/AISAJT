import type { ServerResponse } from 'node:http';

/** Vercel Node serverless koristi običan `ServerResponse` — nema Express `res.status().json()` */
export function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  if (res.writableEnded) return;
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}
