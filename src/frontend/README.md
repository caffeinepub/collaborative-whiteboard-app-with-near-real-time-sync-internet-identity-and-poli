# CollabBoard - Real-time Collaborative Whiteboard

A real-time collaborative whiteboard application built on the Internet Computer with React and Motoko.

## Features

- **Drawing Tools**: Pen, eraser, shapes (rectangle, ellipse, line, arrow), text, and sticky notes
- **Collaboration**: Real-time sync via polling (2-second intervals)
- **Internet Identity**: Secure authentication and user attribution
- **Board Management**: Create, join, and manage multiple boards
- **Export**: Export boards as PNG or JSON
- **Undo/Redo**: Full history support (50+ actions)
- **Zoom & Pan**: Navigate large canvases with ease

## Prerequisites

- Node.js 18+ and pnpm
- DFX SDK (Internet Computer)
- Internet Identity canister (local or mainnet)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

## Running Locally

1. Start the local Internet Computer replica:
   ```bash
   dfx start --clean --background
   ```

2. Deploy the backend canister:
   ```bash
   dfx deploy backend
   ```

3. Generate backend bindings:
   ```bash
   dfx generate backend
   ```

4. Start the frontend dev server:
   ```bash
   cd frontend
   pnpm start
   ```

5. Open two browser windows at `http://localhost:3000` to test collaboration

## Testing Collaboration

1. In the first browser window, create a new board
2. Copy the board code from the Share dialog
3. In the second browser window, join using that board code
4. Draw in one window and watch it appear in the other (within 2 seconds)

## Keyboard Shortcuts

- `V` - Select tool
- `P` - Pen tool
- `E` - Eraser tool
- `R` - Rectangle tool
- `O` - Ellipse tool
- `L` - Line tool
- `A` - Arrow tool
- `T` - Text tool
- `S` - Sticky note tool
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Delete/Backspace` - Delete selected elements

## Building for Production

