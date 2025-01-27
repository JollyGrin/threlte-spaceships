# threlte ships

simulation for translating drone data into a 3d space.

will add visuals/ lasers/ powerups to extend the physical drones flying around

## Installation

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env
```

## Usage

The project has two main routes demonstrating different data sources:

### Root Route (`/`)
The root route at `/` uses a mock data service that simulates drone movements locally. This is useful for development and testing without needing a server.

```bash
# Start the development server
bun run dev
```

### SSE Route (`/sse`)
The `/sse` route uses Server-Sent Events (SSE) to receive real-time drone position updates. This is closer to how it would work with real drones.

To use the SSE version:

1. Start the SSE server:
```bash
bun run server
```

2. In a separate terminal, start the development server:
```bash
bun run dev
```

3. Visit `http://localhost:5173/sse` in your browser

The SSE server will:
- Run on port 3002 by default
- Send real-time position updates
- Handle reconnections automatically
- Show connection status in the UI

---

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

----

# Changelog
