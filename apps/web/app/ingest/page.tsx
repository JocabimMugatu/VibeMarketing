"use client";

import { useState, useEffect, useCallback } from "react";
import LogStream from "../../components/LogStream";
import ProgressBar from "../../components/ProgressBar";
import { LogEvent, ProjectContext } from "../../lib/types";
import { parseContext, createLogStream } from "../../lib/api";

export default function IngestPage() {
  const [githubUrl, setGithubUrl] = useState("");
  const [readmeText, setReadmeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<ProjectContext | null>(null);
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [progress, setProgress] = useState({
    fetch: 0,
    parse: 0,
    tactics: 0,
  });

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

  // Simulate progress updates during loading
  useEffect(() => {
    if (!isLoading) {
      setProgress({ fetch: 0, parse: 0, tactics: 0 });
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => ({
        fetch: Math.min(prev.fetch + 10, 100),
        parse: prev.fetch >= 80 ? Math.min(prev.parse + 15, 90) : 0,
        tactics: prev.parse >= 80 ? Math.min(prev.tactics + 20, 60) : 0,
      }));
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleParseContext = useCallback(async () => {
    if (!githubUrl && !readmeText) {
      setError("Please provide a GitHub URL or paste README text");
      return;
    }

    setIsLoading(true);
    setError(null);
    setContext(null);

    try {
      const result = await parseContext(
        githubUrl || undefined,
        readmeText || undefined
      );
      setContext(result);
      setProgress({ fetch: 100, parse: 100, tactics: 100 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse context");
    } finally {
      setIsLoading(false);
    }
  }, [githubUrl, readmeText]);

  const handleStartIngestion = useCallback(async () => {
    // Start ingestion is same as parse for now
    await handleParseContext();
  }, [handleParseContext]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-10">
        <section className="card-elevated p-8">
          <h3 className="text-lg font-semibold tracking-tight text-white">Project Ingestion</h3>
          <p className="mt-1 text-sm text-neutral-400">
            Drop a GitHub URL or paste a README to build the launch context.
          </p>
          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                GitHub URL
              </label>
              <input
                className="input-base mt-3"
                placeholder="https://github.com/org/repo"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                Or paste README
              </label>
              <textarea
                className="input-base mt-3 h-40 resize-none"
                placeholder="Paste README or product brief here..."
                value={readmeText}
                onChange={(e) => setReadmeText(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="rounded-xl border border-accent-rose-800 bg-accent-rose-950/20 px-5 py-4 text-sm text-accent-rose-300">
                {error}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleStartIngestion}
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? "Processing..." : "Start Ingestion"}
              </button>
              <button
                type="button"
                onClick={handleParseContext}
                disabled={isLoading}
                className="btn-secondary"
              >
                Parse Context
              </button>
            </div>
          </form>
        </section>

        <section className="card-elevated p-8">
          <h3 className="text-lg font-semibold tracking-tight text-white">Context Output</h3>
          <p className="mt-1 text-sm text-neutral-400">Review and adjust the extracted context.</p>
          {context ? (
            <div className="mt-8 space-y-6 text-sm text-neutral-300">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">Product</p>
                <p className="mt-2 text-base font-medium text-white">{context.productName}</p>
                <p className="mt-1 leading-relaxed">{context.summary}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">Audience</p>
                <p className="mt-2 leading-relaxed">{context.audience}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">Value Props</p>
                <ul className="mt-2 space-y-2">
                  {context.valueProps.map((prop, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-primary-400" />
                      <span>{prop}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">Tone</p>
                <p className="mt-2 leading-relaxed">{context.tone}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">Channels</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {context.channels.map((channel) => (
                    <span
                      key={channel}
                      className="badge-neutral"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">Constraints</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {context.constraints.map((item, idx) => (
                    <span
                      key={idx}
                      className="badge-neutral"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 card-subtle p-10 text-center">
              <p className="text-sm text-neutral-500">
                No context parsed yet. Start ingestion to extract project context.
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="space-y-6">
        <section className="card-elevated p-6">
          <h3 className="text-sm font-semibold text-white">Ingestion Progress</h3>
          <div className="mt-6 space-y-5">
            <ProgressBar label="Fetch Repo" value={progress.fetch} />
            <ProgressBar label="Parse Context" value={progress.parse} />
            <ProgressBar label="Generate Tactics" value={progress.tactics} />
          </div>
        </section>
        <LogStream title="Live Mission Log" events={logs} />
      </div>
    </div>
  );
}
