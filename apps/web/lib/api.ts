import { LogEvent, ProjectContext, Tactic } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Generic fetch helper with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

// Context Parser API
export async function parseContext(
  githubUrl?: string,
  readmeText?: string
): Promise<ProjectContext> {
  const response = await fetchAPI<{
    product_name: string;
    summary: string;
    audience: string;
    value_props: string[];
    tone: string;
    channels: string[];
    constraints: string[];
    source: string;
  }>("/context/parse", {
    method: "POST",
    body: JSON.stringify({ github_url: githubUrl, readme_text: readmeText }),
  });

  return {
    productName: response.product_name,
    summary: response.summary,
    audience: response.audience,
    valueProps: response.value_props,
    tone: response.tone,
    channels: response.channels,
    constraints: response.constraints,
  };
}

// Ingestion API
export async function ingestProject(
  githubUrl?: string,
  readmeText?: string
): Promise<{ status: string; context?: ProjectContext }> {
  const response = await fetchAPI<{
    status: string;
    context?: {
      product_name: string;
      summary: string;
      audience: string;
      value_props: string[];
      tone: string;
      channels: string[];
      constraints: string[];
      source: string;
    };
  }>("/ingest", {
    method: "POST",
    body: JSON.stringify({ github_url: githubUrl, readme_text: readmeText }),
  });

  return {
    status: response.status,
    context: response.context
      ? {
          productName: response.context.product_name,
          summary: response.context.summary,
          audience: response.context.audience,
          valueProps: response.context.value_props,
          tone: response.context.tone,
          channels: response.context.channels,
          constraints: response.context.constraints,
        }
      : undefined,
  };
}

// Tactics API
export async function getTactics(): Promise<{ tactics: Tactic[]; count: number }> {
  const response = await fetchAPI<{
    tactics: Array<{
      id: string;
      name: string;
      tier: string;
      summary: string;
      impact: string;
      channels: string[];
    }>;
    count: number;
  }>("/tactics");

  return {
    tactics: response.tactics.map((t) => ({
      id: t.id,
      name: t.name,
      tier: t.tier as "Foundation" | "Growth" | "Viral",
      summary: t.summary,
      impact: t.impact,
      channels: t.channels,
    })),
    count: response.count,
  };
}

// Logs API
export async function getLogs(limit: number = 50): Promise<LogEvent[]> {
  return fetchAPI<LogEvent[]>(`/logs?limit=${limit}`);
}

export async function createLog(
  level: "info" | "warning" | "error" | "success",
  message: string,
  source?: string
): Promise<LogEvent> {
  return fetchAPI<LogEvent>("/logs", {
    method: "POST",
    body: JSON.stringify({ level, message, source }),
  });
}

// SSE Log Stream
export function createLogStream(
  onMessage: (event: LogEvent) => void,
  onError?: (error: Error) => void
): () => void {
  const eventSource = new EventSource(`${API_BASE_URL}/logs/stream`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data as LogEvent);
    } catch (err) {
      console.error("Failed to parse log event:", err);
    }
  };

  eventSource.onerror = (error) => {
    console.error("SSE Error:", error);
    if (onError) {
      onError(new Error("Log stream connection failed"));
    }
  };

  // Return cleanup function
  return () => {
    eventSource.close();
  };
}

// Launch API
export interface WorkflowStep {
  id: string;
  title: string;
  owner: string;
  status: "Backlog" | "In Progress" | "Review" | "Shipped";
  due?: string;
}

export interface LaunchPlan {
  id: string;
  name: string;
  stages: Array<{
    title: string;
    detail: string;
    status: "complete" | "active" | "upcoming";
  }>;
  steps: WorkflowStep[];
  created_at: string;
  updated_at: string;
}

export async function getLaunchPlans(): Promise<LaunchPlan[]> {
  return fetchAPI<LaunchPlan[]>("/launch/plans");
}

export async function createLaunchPlan(name: string): Promise<LaunchPlan> {
  return fetchAPI<LaunchPlan>(`/launch/plans?name=${encodeURIComponent(name)}`, {
    method: "POST",
  });
}

export async function addWorkflowStep(
  planId: string,
  step: {
    title: string;
    owner: string;
    status?: string;
    due?: string;
  }
): Promise<WorkflowStep> {
  return fetchAPI<WorkflowStep>(`/launch/plans/${planId}/steps`, {
    method: "POST",
    body: JSON.stringify(step),
  });
}

export async function updateStepStatus(
  stepId: string,
  status: "Backlog" | "In Progress" | "Review" | "Shipped"
): Promise<WorkflowStep> {
  return fetchAPI<WorkflowStep>(`/launch/steps/${stepId}?status=${status}`, {
    method: "PATCH",
  });
}

export async function getKanbanBoard(): Promise<{
  columns: Array<{
    title: string;
    items: Array<{
      id: string;
      title: string;
      owner: string;
      due?: string;
    }>;
  }>;
}> {
  return fetchAPI("/launch/board");
}

// Health check
export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL.replace("/api", "")}/health`);
  if (!response.ok) {
    throw new Error("Health check failed");
  }
  return response.json();
}
