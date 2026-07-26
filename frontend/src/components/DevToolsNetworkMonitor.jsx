import React, { useState, useEffect } from 'react';
import { Terminal, Trash2, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function DevToolsNetworkMonitor() {
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Initial load
    if (window.__networkLogs) {
      setLogs([...window.__networkLogs]);
    }

    const handleLogEvent = () => {
      if (window.__networkLogs) {
        setLogs([...window.__networkLogs]);
      }
    };

    window.addEventListener('network-log', handleLogEvent);
    return () => window.removeEventListener('network-log', handleLogEvent);
  }, []);

  const handleClear = () => {
    window.__networkLogs = [];
    setLogs([]);
  };

  return (
    <div id="devtools-network-monitor" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-slate-200 border-t-2 border-emerald-500 shadow-2xl font-mono text-[11px]">
      {/* Header bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between bg-slate-950 border-b border-slate-800 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            CHROME DEVTOOLS SIMULATOR — NETWORK MONITOR
          </span>
          <span className="text-slate-500 text-[10px]">({logs.length} requests captured)</span>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={handleClear}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear all logs"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2 py-0.5 rounded bg-slate-850 hover:bg-slate-750 text-slate-300 text-[10px] font-sans flex items-center gap-1 transition-all cursor-pointer"
          >
            {isOpen ? (
              <>
                <ChevronDown className="h-3 w-3" />
                <span>Collapse Panel</span>
              </>
            ) : (
              <>
                <ChevronUp className="h-3 w-3" />
                <span>Expand Monitor ({logs.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Logs Table Area */}
      {isOpen && (
        <div className="max-w-7xl mx-auto overflow-x-auto max-h-36 scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-850 font-bold text-[10px] uppercase select-none">
                <th className="py-2 px-3">Name / Endpoint</th>
                <th className="py-2 px-3 w-20">Method</th>
                <th className="py-2 px-3 w-24">Status</th>
                <th className="py-2 px-3 w-20">Type</th>
                <th className="py-2 px-3 w-24">Size</th>
                <th className="py-2 px-3 w-24">Time / Latency</th>
                <th className="py-2 px-3 w-16">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-500 font-light select-none">
                    [Network Monitor Idle] Click around the app or consult the AI advisor to trigger REST API requests.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-slate-850/60 transition-colors ${
                      log.isError ? 'bg-red-950/20 text-red-300' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-1.5 px-3 font-semibold truncate max-w-xs" title={log.url}>
                      {log.name}
                    </td>
                    <td className="py-1.5 px-3">
                      <span className={`font-bold ${log.method === 'POST' ? 'text-blue-400' : log.method === 'DELETE' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="py-1.5 px-3">
                      <div className="flex items-center gap-1">
                        {log.isError ? (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        ) : (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        )}
                        <span className={log.isError ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {log.statusText}
                        </span>
                      </div>
                    </td>
                    <td className="py-1.5 px-3 text-slate-450">fetch</td>
                    <td className="py-1.5 px-3 font-medium">{log.size}</td>
                    <td className="py-1.5 px-3 text-slate-400">{log.latency}</td>
                    <td className="py-1.5 px-3 text-slate-500 text-[10px]">{log.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
