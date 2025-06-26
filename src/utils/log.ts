type Stack = "frontend" | "backend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";

type PackageName =
  | "cache" | "controller" | "cron_job" | "db" | "domain"
  | "handler" | "repository" | "route" | "service"
  | "api" | "component" | "hook" | "page" | "state" | "style"
  | "auth" | "config" | "middleware" | "utils";

interface LogPayload {
  stack: Stack;
  level: Level;
  package: PackageName;
  message: string;
}

const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaGFpdGhhbnlhY2hhaXRodTU4MEBnbWFpbC5jb20iLCJleHAiOjE3NTA5MjIyMjksImlhdCI6MTc1MDkyMTMyOSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjAyNGUyNjE3LTU5NDktNDc4OC05OThkLWRlNjlhMjgzNmZmNSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImJhbmRlbGEgamF5YSBzYXR5YSBjaGFpdGhhbnlhIiwic3ViIjoiODE4NGE0YTItNjQxNy00NWEzLThhMjctMzA0ZTM1MjNlMDA3In0sImVtYWlsIjoiY2hhaXRoYW55YWNoYWl0aHU1ODBAZ21haWwuY29tIiwibmFtZSI6ImJhbmRlbGEgamF5YSBzYXR5YSBjaGFpdGhhbnlhIiwicm9sbE5vIjoiMjJhOTFhNjFkNSIsImFjY2Vzc0NvZGUiOiJORndnUlQiLCJjbGllbnRJRCI6IjgxODRhNGEyLTY0MTctNDVhMy04YTI3LTMwNGUzNTIzZTAwNyIsImNsaWVudFNlY3JldCI6IkV3cXd0UFBCRnZNWHNFVEEifQ.A2twKfBp6q_wNRoNZiG8zUB2Kl-p1TtbbAZfkXvvQ5k";

export async function Log(
  stack: Stack,
  level: Level,
  packageName: PackageName,
  message: string
): Promise<void> {
  const validPackages = {
    frontend: ["api", "component", "hook", "page", "state", "style", "auth", "config", "middleware", "utils"],
    backend: ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service", "auth", "config", "middleware", "utils"],
  };

  if (!validPackages[stack].includes(packageName)) {
    throw new Error(`Invalid package "${packageName}" for stack "${stack}"`);
  }

  const payload: LogPayload = { stack, level, package: packageName, message };

  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Logging failed:", result.message);
    } else {
      console.log("Log success:", result.message, "Log ID:", result.logID);
    }
  } catch (error) {
    console.error("Network/log error:", (error as Error).message);
  }
}
