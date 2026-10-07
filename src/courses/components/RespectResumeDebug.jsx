import { useEffect, useMemo, useState } from "react";
import "./respectResumeDebug.css";

const readLogs = () => window.__respectResumeLogs ?? [];

const RespectResumeDebug = () => {
  const [logs, setLogs] = useState(readLogs);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleLog = () => setLogs([...readLogs()]);
    window.addEventListener("respect-resume-log", handleLog);
    return () => window.removeEventListener("respect-resume-log", handleLog);
  }, []);

  const output = useMemo(
    () => logs.map(({ time, event, details }) => `${time} ${event} ${JSON.stringify(details)}`).join("\n"),
    [logs],
  );

  if (!sessionStorage.getItem("respect-launch-params")) return null;

  const copyLogs = async () => {
    try {
      await navigator.clipboard.writeText(output || "No resume events recorded");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className={`respect-resume-debug ${open ? "is-open" : ""}`} aria-label="Resume diagnostics">
      <button
        type="button"
        className="respect-resume-debug__toggle"
        onClick={() => setOpen((value) => !value)}
      >
        Resume log ({logs.length})
      </button>
      {open && (
        <div className="respect-resume-debug__body">
          <div className="respect-resume-debug__actions">
            <strong>Temporary resume diagnostics</strong>
            <button type="button" onClick={copyLogs}>{copied ? "Copied" : "Copy"}</button>
          </div>
          <pre>{output || "No resume events recorded yet."}</pre>
        </div>
      )}
    </section>
  );
};

export default RespectResumeDebug;
