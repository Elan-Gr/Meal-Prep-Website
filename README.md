# Meal Prep Optimizer

Meal Prep Optimizer is a static-first React/Vite proof of concept for planning a weekly meal-prep schedule. It lets you select diet preferences, appliances, cooking windows, and foods to avoid, then generates a meal calendar, grocery list, cooking schedule, and prep cards.

## Prerequisites

Before initializing the project, install:

- **Node.js 18 or newer** (Node 20 LTS is recommended)
- **npm** (included with Node.js)

Verify your local versions:

```bash
node --version
npm --version
```

## Initialize the project

From a terminal, clone or open the repository and move into the project directory:

```bash
cd Meal-Prep-Website
```

Install the JavaScript dependencies:

```bash
npm install
```

This installs the app dependencies defined in `package.json`, including Vite, React, Express, TypeScript, Tailwind CSS, PostCSS, and Autoprefixer.

## Start the development server

Use the Vite development server while actively working on the app:

```bash
npm run dev
```

By default, Vite starts on:

```text
http://localhost:5173
```

The dev script binds to `0.0.0.0`, so the site can also be reached from a forwarded port or container preview URL when running in a cloud/container environment.

## Build the production files

Create an optimized production build:

```bash
npm run build
```

The generated static files are written to:

```text
dist/
```

## Start the production server

After building the app, start the Express server:

```bash
npm run server
```

The server serves the files from `dist/` and listens on port `4174` by default:

```text
http://localhost:4174
```

You can override the port with the `PORT` environment variable:

```bash
PORT=8080 npm run server
```

## Preview the production build with Vite

As an alternative to the Express server, you can preview the production build with Vite:

```bash
npm run preview
```

Vite preview serves the built app and is useful for checking production output locally before deployment.

## Health check endpoint

When the Express production server is running, verify it with:

```bash
curl http://localhost:4174/api/health
```

Expected response:

```json
{"ok":true,"mode":"local-static-data"}
```

If you changed the server port, replace `4174` with your chosen port.

## Common workflows

### First-time local setup

```bash
cd Meal-Prep-Website
npm install
npm run dev
```

### Production-style local run

```bash
cd Meal-Prep-Website
npm install
npm run build
npm run server
```

### Reinstall dependencies from scratch

If dependencies become inconsistent, remove installed packages and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Available npm scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `vite --host 0.0.0.0` | Starts the Vite development server. |
| `build` | `vite build` | Builds optimized production assets into `dist/`. |
| `preview` | `vite preview --host 0.0.0.0` | Serves the built app with Vite preview. |
| `server` | `node server/index.js` | Starts the Express server for the built static app. |

## Troubleshooting

### `npm run server` cannot find `dist/index.html`

Run the production build first:

```bash
npm run build
npm run server
```

### Port already in use

For the Express server, choose another port:

```bash
PORT=8080 npm run server
```

For the Vite dev server, edit the port in `vite.config.ts` or stop the process already using port `5173`.

### Dependencies fail to install

Check that Node.js is version 18 or newer, then try reinstalling:

```bash
node --version
rm -rf node_modules package-lock.json
npm install
```

## Project structure

```text
.
├── data/                  # Static meal, ingredient, component, and config data
├── server/index.js        # Express server for production static files and health check
├── src/client/            # React client application
├── src/shared/            # Shared optimizer, default preferences, data, and types
├── index.html             # Vite HTML entry point
├── package.json           # npm scripts and dependencies
└── vite.config.ts         # Vite development server configuration
```
