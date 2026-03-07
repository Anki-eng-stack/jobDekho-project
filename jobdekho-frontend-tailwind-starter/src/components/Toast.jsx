import React, { useEffect, useState } from "react";

/**
 * Usage:
 * <Toast message="Applied successfully!" type="success" onClose={() => setToast(null)} />
 *
 * types: "success" | "error" | "info" | "warning"
 */

const icons = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const styles = {
  success: { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d", progress: "#16a34a" },
  error: { bg: "#fff1f2", border: "#fecaca", color: "#dc2626", progress: "#ef4444" },
  warning: { bg: "#fffbeb", border: "#fde68a", color: "#b45309", progress: "#f59e0b" },
  info: { bg: "#f5f3ff", border: "#ddd6fe", color: "#6d28d9", progress: "#7c3aed" },
};

const Toast = ({ message, type = "info", onClose, duration = 4000 }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const s = styles[type] || styles.info;

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => handleClose(), duration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onClose?.(), 300);
  };

  return (
    <>
      <style>{`
        .jd-toast-outer {
          position: fixed;
          top: 1.25rem;
          right: 1.25rem;
          z-index: 9999;
          font-family: "Manrope", sans-serif;
        }

        .jd-toast {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-radius: 14px;
          border: 1.5px solid;
          min-width: 280px;
          max-width: 380px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06);
          transform: translateX(120%);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .jd-toast.visible {
          transform: translateX(0);
          opacity: 1;
        }

        .jd-toast.leaving {
          transform: translateX(120%);
          opacity: 0;
          transition: all 0.25s ease-in;
        }

        .jd-toast-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.7);
        }

        .jd-toast-body {
          flex: 1;
        }

        .jd-toast-type {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.7;
          margin-bottom: 2px;
        }

        .jd-toast-message {
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.4;
        }

        .jd-toast-close {
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.5;
          padding: 2px;
          transition: opacity 0.15s;
          flex-shrink: 0;
          color: inherit;
        }

        .jd-toast-close:hover {
          opacity: 1;
        }

        .jd-toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          border-radius: 0 0 14px 14px;
          animation: jdToastProgress linear forwards;
        }

        @keyframes jdToastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      <div className="jd-toast-outer">
        <div
          className={`jd-toast ${visible ? "visible" : ""} ${leaving ? "leaving" : ""}`}
          style={{ background: s.bg, borderColor: s.border, color: s.color }}
        >
          <div className="jd-toast-icon">{icons[type] || icons.info}</div>

          <div className="jd-toast-body">
            <p className="jd-toast-type">{type}</p>
            <p className="jd-toast-message">{message}</p>
          </div>

          <button className="jd-toast-close" onClick={handleClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div
            className="jd-toast-progress"
            style={{ background: s.progress, animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </>
  );
};

export default Toast;
