"use client";

import { useState, useEffect } from "react";
import LogStream from "../components/LogStream";
import ProgressBar from "../components/ProgressBar";
import StatCard from "../components/StatCard";
import { LogEvent } from "../lib/types";
import { getLogs, createLogStream, getKanbanBoard, getLaunchPlans } from "../lib/api";

export default function DashboardPage() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [stats, setStats] = useState({
    readiness: 82,
    pipeline: "$420k",
    retention: "7.4",
    backlogCount: 0,
    inProgressCount: 0,
    reviewCount: 0,
    shippedCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Connect to SSE log stream
  useEffect(() => {
    const cleanup = createLogStream(
      (event) => {
        setLogs((prev) => [event, ...prev].slice(0, 50));
      },
      (err) => {
        console.error("Log stream error:", err);
      }
    );

    return cleanup;
  }, []);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [logsData, boardData, plansData] = await Promise.all([
          getLogs(10),
          getKanbanBoard(),
          getLaunchPlans(),
        ]);

        setLogs(logsData);

        // Calculate board counts
        const columns = boardData.columns;
        const backlog = columns.find((c) => c.title === "Backlog")?.items.length || 0;
        const inProgress = columns.find((c) => c.title === "In Progress")?.items.length || 0;
        const review = columns.find((c) => c.title === "Review")?.items.length || 0;
        const shipped = columns.find((c) => c.title === "Shipped")?.items.length || 0;

        // Calculate readiness based on shipped ratio
        const total = backlog + inProgress + review + shipped;
        const readiness = total > 0 ? Math.round((shipped / total) * 100) : 0;

        setStats({
          readiness,
          pipeline: `${420 + shipped * 10}k`,
          retention: (7.4 + shipped * 0.1).toFixed(1),
          backlogCount: backlog,
          inProgressCount: inProgress,
          reviewCount: review,
          shippedCount: shipped,
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Add some sample log events if none exist
  useEffect(() => {
    if (!isLoading && logs.length === 0) {
      setLogs([
        {
          id: "log-1",
          timestamp: "2m ago",
          level: "success",
          message: "Ingestion completed for inbound waitlist campaign",
          source: "Ingest",
        },
        {
          id: "log-2",
          timestamp: "5m ago",
          level: "info",
          message: "Persona refresh: Added Growth PM archetype",
          source: "Context",
        },
        {
          id: "log-3",
          timestamp: "12m ago",
          level: "warning",
          message: "Launch channel overlap detected in paid social",
          source: "Magic Launch",
        },
      ]);
    }
  }, [isLoading, logs.length]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-800 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h3 className="text-lg font-semibold tracking-tight text-white">Launch Overview</h3>
        <p className="mt-1 text-sm text-neutral-400">
          Pulse check on launch readiness, pipeline health, and execution velocity.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard label="Launch Readiness" value={`${stats.readiness}%`} trend="+6% wk" />
          <StatCard label="Pipeline Coverage" value={stats.pipeline} trend="+14% wk" />
          <StatCard label="Retention Signals" value={stats.retention} trend="+0.8" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card-elevated p-8">
          <h4 className="text-sm font-semibold text-white">Quarterly Objectives</h4>
          <div className="mt-8 space-y-6">
            <ProgressBar label="Narrative Alignment" value={76} />
            <ProgressBar label="Activation Journey" value={58} />
            <ProgressBar label="Launch Assets" value={64} />
            <ProgressBar label="Channel Readiness" value={71} />
          </div>
        </div>
        <div className="card-elevated p-6">
          <h4 className="text-sm font-semibold text-white">Kanban Summary</h4>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="card-subtle p-4 text-center">
              <p className="text-2xl font-semibold tracking-tight text-white">{stats.backlogCount}</p>
              <p className="mt-1 text-xs text-neutral-500">Backlog</p>
            </div>
            <div className="card-subtle p-4 text-center">
              <p className="text-2xl font-semibold tracking-tight text-primary-400">{stats.inProgressCount}</p>
              <p className="mt-1 text-xs text-neutral-500">In Progress</p>
            </div>
            <div className="card-subtle p-4 text-center">
              <p className="text-2xl font-semibold tracking-tight text-accent-amber-400">{stats.reviewCount}</p>
              <p className="mt-1 text-xs text-neutral-500">Review</p>
            </div>
            <div className="card-subtle p-4 text-center">
              <p className="text-2xl font-semibold tracking-tight text-accent-emerald-400">{stats.shippedCount}</p>
              <p className="mt-1 text-xs text-neutral-500">Shipped</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <LogStream title="Live Mission Log" events={logs} />
        <div className="card-elevated p-6">
          <h4 className="text-sm font-semibold text-white">Next Moves</h4>
          <div className="mt-6 space-y-6 text-sm text-neutral-300">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">Today</p>
              <p className="mt-2">Review context extraction and approve tactics shortlist.</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">This Week</p>
              <p className="mt-2">Lock launch narrative and content calendar.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
