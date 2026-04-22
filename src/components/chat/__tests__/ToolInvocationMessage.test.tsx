import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolInvocationMessage } from "../ToolInvocationMessage";

test("ToolInvocationMessage renders 'Creating' for str_replace_editor create command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "create", path: "/App.jsx" },
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("ToolInvocationMessage renders 'Editing' for str_replace_editor str_replace command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "str_replace", path: "/styles.css" },
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing /styles.css")).toBeDefined();
});

test("ToolInvocationMessage renders 'Inserting' for str_replace_editor insert command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "insert", path: "/components/Button.tsx" },
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Inserting into /components/Button.tsx")).toBeDefined();
});

test("ToolInvocationMessage renders 'Viewing' for str_replace_editor view command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "view", path: "/package.json" },
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Viewing /package.json")).toBeDefined();
});

test("ToolInvocationMessage renders 'Deleting' for file_manager delete command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    state: "result",
    result: "Success",
    args: { command: "delete", path: "/old-component.tsx" },
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleting /old-component.tsx")).toBeDefined();
});

test("ToolInvocationMessage renders 'Renaming' for file_manager rename command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    state: "result",
    result: "Success",
    args: { command: "rename", path: "/Button.tsx", new_path: "/Button.old.tsx" },
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Renaming /Button.tsx → /Button.old.tsx")).toBeDefined();
});

test("ToolInvocationMessage shows spinner when state is not result", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "pending",
    args: { command: "create", path: "/App.jsx" },
  };

  const { container } = render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  // Check for animated spinner
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
  expect(spinner?.className).toContain("text-blue-600");
});

test("ToolInvocationMessage shows checkmark when state is result with result", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "create", path: "/App.jsx" },
  };

  const { container } = render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  // Check for checkmark dot
  const checkmark = container.querySelector(".bg-emerald-500");
  expect(checkmark).toBeDefined();
});

test("ToolInvocationMessage handles stringified JSON args", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: JSON.stringify({ command: "create", path: "/index.tsx" }),
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating /index.tsx")).toBeDefined();
});

test("ToolInvocationMessage handles missing args", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  // Should fall back to tool name when no args
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("ToolInvocationMessage handles unknown command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "unknown", path: "/file.tsx" },
  };

  render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  // Should fall back to tool name for unknown commands
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("ToolInvocationMessage shows spinner for undo_edit command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "pending",
    args: { command: "undo_edit", path: "/Component.tsx" },
  };

  const { container } = render(<ToolInvocationMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Undoing edit in /Component.tsx")).toBeDefined();
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});
