export type TacticTier = "Foundation" | "Growth" | "Viral";

export interface ProjectContext {
  productName: string;
  summary: string;
  audience: string;
  valueProps: string[];
  tone: string;
  channels: string[];
  constraints: string[];
}

export interface Tactic {
  id: string;
  name: string;
  tier: TacticTier;
  summary: string;
  impact: string;
  channels: string[];
}

export interface WorkflowStep {
  id: string;
  title: string;
  owner: string;
  status: "Backlog" | "In Progress" | "Review" | "Shipped";
  due?: string;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
  source?: string;
}
