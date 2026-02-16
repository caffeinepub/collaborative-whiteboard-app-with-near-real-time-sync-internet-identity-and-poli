# Specification

## Summary
**Goal:** Add per-board whiteboard background templates (Blank/Dots/Grid/Lines) that persist for all collaborators, with a template picker on board creation and an in-board toggle to change it later.

**Planned changes:**
- Add a board `backgroundMode` metadata field with values: `blank` | `dots` | `grid` | `lines`, defaulting to `blank` for existing boards.
- Update backend snapshot (and any incremental changes responses used by polling sync) to include `backgroundMode` without breaking existing collaboration/drawing sync.
- Render the selected background on the canvas behind all elements, anchored to world space so it stays aligned during pan/zoom.
- Add a “Create New Board” modal with board name input + template selection tiles (Blank/Dots/Grid/Lines) + Cancel/Create actions; disable Create until name is non-empty after trim; apply chosen template on creation.
- Add an in-board UI control to switch background mode (Blank/Dots/Grid/Lines) and persist the change so collaborators converge after sync/polling.

**User-visible outcome:** Users can choose a background template when creating a board and can switch the board’s background from within the board; the chosen background persists and is shared across collaborators and reloads.
