"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  label?: string
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] px-6 py-10 text-center"
          style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)" }}
        >
          <AlertTriangle size={20} strokeWidth={1.5} style={{ color: "var(--status-broken)" }} />
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
            {this.props.label ?? "This section failed to load"}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-md"
            style={{
              color: "var(--text-tertiary)",
              border: "1px solid var(--border)",
              background: "var(--bg-elevated-2)",
            }}
          >
            <RefreshCw size={11} />
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
