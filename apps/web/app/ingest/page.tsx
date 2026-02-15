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
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Project Ingestion</h3>
          <p className="text-sm text-slate-400">
            Drop a GitHub URL or paste a README to build the launch context.
          </p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                GitHub URL
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600"
                placeholder="https://github.com/org/repo"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Or paste README
              </label>
              <textarea
                className="mt-2 h-40 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600"
                placeholder="Paste README or product brief here..."
                value={readmeText}
                onChange={(e) => setReadmeText(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="rounded-lg border border-rose-800 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleStartIngestion}
                disabled={isLoading}
                className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Start Ingestion"}
              </button>
              <button
                type="button"
                onClick={handleParseContext}
                disabled={isLoading}
                className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-slate-200 disabled:opacity-50"
              >
                Parse Context
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Context Output</h3>
          <p className="text-sm text-slate-400">Review and adjust the extracted context.</p>
          {context ? (
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Product</p>
                <p className="mt-2 text-base text-white">{context.productName}</p>
                <p className="mt-1">{context.summary}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Audience</p>
                <p className="mt-2">{context.audience}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Value Props</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {context.valueProps.map((prop, idx) => (
                    <li key={idx}>{prop}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tone</p>
                <p className="mt-2">{context.tone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Channels</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {context.channels.map((channel) => (
                    <span
                      key={channel}
                      className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Constraints</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {context.constraints.map((item, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-8 text-center">
              <p className="text-sm text-slate-500">
                No context parsed yet. Start ingestion to extract project context.
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Ingestion Progress</h3>
          <div className="mt-6 space-y-4">
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
