"use client";

import { Loader2, CheckCircle2 } from "lucide-react";

interface ToolInvocationMessageProps {
  toolInvocation: {
    toolName: string;
    state: string;
    result?: string;
    args?: string | Record<string, any>;
  };
}

function parseArgs(args: string | Record<string, any> | undefined): Record<string, any> {
  if (!args) return {};
  if (typeof args === "string") {
    try {
      return JSON.parse(args);
    } catch {
      return {};
    }
  }
  return args;
}

function buildActionMessage(toolName: string, args: Record<string, any>): string {
  const command = args.command || "";
  const path = args.path || "";
  const newPath = args.new_path || "";

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return `Creating ${path}`;
      case "str_replace":
        return `Editing ${path}`;
      case "insert":
        return `Inserting into ${path}`;
      case "view":
        return `Viewing ${path}`;
      case "undo_edit":
        return `Undoing edit in ${path}`;
      default:
        return "str_replace_editor";
    }
  } else if (toolName === "file_manager") {
    switch (command) {
      case "delete":
        return `Deleting ${path}`;
      case "rename":
        return `Renaming ${path} → ${newPath}`;
      default:
        return "file_manager";
    }
  }

  return toolName;
}

export function ToolInvocationMessage({ toolInvocation }: ToolInvocationMessageProps) {
  const args = parseArgs(toolInvocation.args);
  const message = buildActionMessage(toolInvocation.toolName, args);
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
