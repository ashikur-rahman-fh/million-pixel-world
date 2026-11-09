"use client";

import type { DrawingSettings, DrawingTool } from "@/types/world.types";

interface WorldToolbarProps {
  settings: DrawingSettings;
  onSettingsChange: (settings: DrawingSettings) => void;
}

const COLORS = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#ff8800",
  "#ffdf00",
  "#00bb55",
  "#168cff",
  "#813bdb",
  "#ff69b4",
  "#795548",
  "#808080",
  "#00bcd4",
];

export function WorldToolbar({ settings, onSettingsChange }: WorldToolbarProps) {
  function selectTool(tool: DrawingTool) {
    onSettingsChange({
      ...settings,
      tool,
    });
  }

  function selectColor(color: string) {
    onSettingsChange({
      tool: "pencil",
      color,
    });
  }

  return (
    <div className="world-toolbar">
      <div className="toolbar-heading">
        <span>Drawing tools</span>
        <span className="toolbar-status">{settings.tool === "pencil" ? "Pencil" : "Eraser"}</span>
      </div>

      {/* Tools */}
      <div className="toolbar-tools">
        <button
          type="button"
          className={`tool-button ${settings.tool === "pencil" ? "active" : ""}`}
          onClick={() => selectTool("pencil")}
          aria-label="Pencil tool"
          aria-pressed={settings.tool === "pencil"}
          title="Pencil"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="m16 4 4 4L9 19l-5 1 1-5L16 4Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className={`tool-button ${settings.tool === "eraser" ? "active" : ""}`}
          onClick={() => selectTool("eraser")}
          aria-label="Eraser tool"
          aria-pressed={settings.tool === "eraser"}
          title="Eraser"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="m7 21-4-4a2 2 0 0 1 0-3l9-9a2 2 0 0 1 3 0l6 6a2 2 0 0 1 0 3l-7 7H7Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m9 9 6 6M12 21h9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Color palette */}
      <div className="toolbar-label">Colors</div>

      <div className="color-palette">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-button ${settings.color.toLowerCase() === color ? "selected" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => selectColor(color)}
            aria-label={`Select ${color}`}
            aria-pressed={settings.color.toLowerCase() === color}
            title={color}
          />
        ))}
      </div>

      <div className="toolbar-divider" />

      {/* Custom color picker */}
      <label className="custom-color-picker">
        <span className="custom-color-preview" style={{ backgroundColor: settings.color }} />

        <span className="custom-color-text">
          Custom color
          <small>{settings.color.toUpperCase()}</small>
        </span>

        <input
          type="color"
          value={settings.color}
          onChange={(e) => selectColor(e.target.value)}
          aria-label="Choose custom drawing color"
        />
      </label>
    </div>
  );
}
