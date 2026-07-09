# Meal Prep Optimizer

Meal Prep Optimizer is a dependency-free Node.js web app for planning a weekly meal-prep schedule. It lets you select diet preferences, appliances, cooking windows, and foods to avoid, then generates a meal calendar, grocery list, cooking schedule, and prep cards.

## Prerequisites

Install **Node.js 18 or newer**. No npm packages are required.

Verify your local version:

```bash
node --version
```

## Run the app

From a terminal, clone or open the repository and move into the project directory:

```bash
cd Meal-Prep-Website
```

Start the Node.js server:

```bash
node server/index.js
```

You can also use the npm script, which runs the same Node.js command:

```bash
npm start
```

The server listens on port `4174` by default:

```text
http://localhost:4174
```

Override the port with the `PORT` environment variable:

```bash
PORT=8080 node server/index.js
```

## Health check endpoint

When the server is running, verify it with:

```bash
curl http://localhost:4174/api/health
```

Expected response:

```json
{"ok":true,"mode":"node-static-data"}
```

If you changed the server port, replace `4174` with your chosen port.

## Available npm scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `start` | `node server/index.js` | Starts the dependency-free Node.js server. |
| `server` | `node server/index.js` | Alias for starting the Node.js server. |

## Project structure

```text
.
├── data/                  # Static meal, ingredient, component, and config notes
├── server/index.js        # Native Node.js static server and health check
├── src/client/app.js      # Browser JavaScript application and optimizer
├── src/client/style.css   # Plain CSS styles
├── index.html             # HTML entry point served directly by Node.js
└── package.json           # Node.js start scripts
```
