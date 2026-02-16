import { useEffect, useRef, useState } from "react";
import { streamLogs } from "~/lib/api";

interface LogStreamProps {
  service: string;
  pod?: string;
  follow?: boolean;
  tailLines?: string;
  onError?: (error: Error) => void;
}

export function LogStream({
  service,
  pod,
  follow = true,
  tailLines = "100",
  onError,
}: LogStreamProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const pausedLogsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!service) return;

    // Clean up previous connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    setIsConnected(false);
    setLogs([]);
    pausedLogsRef.current = [];

    try {
      const ws = streamLogs(service, pod, follow, tailLines);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const logLine = event.data;
        if (typeof logLine === "string") {
          if (isPaused) {
            pausedLogsRef.current.push(logLine);
          } else {
            setLogs((prev) => [...prev, logLine]);
          }
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        if (onError) {
          onError(new Error("WebSocket connection error"));
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      if (onError) {
        onError(error as Error);
      }
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [service, pod, follow, tailLines, onError]);

  // Handle pause/resume
  useEffect(() => {
    if (!isPaused && pausedLogsRef.current.length > 0) {
      setLogs((prev) => [...prev, ...pausedLogsRef.current]);
      pausedLogsRef.current = [];
    }
  }, [isPaused]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const handleClear = () => {
    setLogs([]);
    pausedLogsRef.current = [];
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleScrollToggle = () => {
    setAutoScroll(!autoScroll);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-[var(--color-studojo-surface-muted)] border-b-2 border-[var(--color-studojo-ink)]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${
                isConnected ? "bg-[var(--color-studojo-green)]" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-['Satoshi'] text-[var(--color-studojo-muted)]">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          {isPaused && (
            <span className="px-2 py-1 bg-[var(--color-studojo-yellow-bg)] text-[var(--color-studojo-yellow)] rounded text-xs font-['Satoshi'] font-medium">
              Paused
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePauseToggle}
            className="px-3 py-1 border-2 border-[var(--color-studojo-ink)] rounded-lg font-['Satoshi'] text-sm font-medium hover:bg-[var(--color-studojo-surface-muted)] transition-colors"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={handleScrollToggle}
            className={`px-3 py-1 border-2 border-[var(--color-studojo-ink)] rounded-lg font-['Satoshi'] text-sm font-medium hover:bg-[var(--color-studojo-surface-muted)] transition-colors ${
              autoScroll ? "bg-[var(--color-studojo-purple-bg)]" : ""
            }`}
          >
            {autoScroll ? "Auto-scroll: On" : "Auto-scroll: Off"}
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 border-2 border-[var(--color-studojo-ink)] rounded-lg font-['Satoshi'] text-sm font-medium hover:bg-[var(--color-studojo-surface-muted)] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Logs Display */}
      <div className="flex-1 overflow-y-auto bg-black text-green-400 font-mono text-sm p-4">
        {logs.length === 0 && !isConnected && (
          <div className="text-gray-500 text-center py-8">
            Connecting to log stream...
          </div>
        )}
        {logs.length === 0 && isConnected && (
          <div className="text-gray-500 text-center py-8">
            Waiting for logs...
          </div>
        )}
        {logs.map((log, index) => (
          <div key={index} className="mb-1 whitespace-pre-wrap break-words">
            {log}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Footer */}
      <div className="p-2 bg-[var(--color-studojo-surface-muted)] border-t-2 border-[var(--color-studojo-ink)] text-xs font-['Satoshi'] text-[var(--color-studojo-muted)]">
        {logs.length} lines {isPaused ? "(paused)" : ""}
      </div>
    </div>
  );
}

