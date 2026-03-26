# co-dev — Automated Code Quality Bot

A Next.js web application that acts as an autonomous code-quality agent. It listens for SonarQube webhook events, invokes GitHub Copilot CLI to analyze and fix reported issues, then opens a pull request via the GitHub MCP integration — all without human intervention.

---

## How It Works

```
SonarQube detects issue
        │
        ▼
POST /api/sonarqube/webhook   (Next.js API route)
        │
        ▼
Validate HMAC signature + parse payload
        │
        ▼
Spawn GitHub Copilot CLI  (gh copilot suggest ...)
        │
        ▼
Copilot creates a feature branch, fixes the issue, commits
        │
        ▼
GitHub MCP tool  →  opens Pull Request
```

---

## Tech Stack

| Layer                | Choice                                                    |
| -------------------- | --------------------------------------------------------- |
| Web framework        | Next.js 16 (App Router)                                   |
| AI / Copilot CLI     | GitHub Copilot CLI (`gh copilot`)                           |
| Code quality trigger | SonarQube webhooks                                        |
| GitHub automation    | GitHub MCP server (`@modelcontextprotocol/server-github`) |
| Language             | TypeScript                                                |

---

## Project Structure

```
co-dev/
├── src/
│   └── app/
│       ├── api/
│       │   └── sonarqube/
│       │       └── webhook/
│       │           └── route.ts        # SonarQube webhook handler
│       ├── layout.tsx
│       └── page.tsx                    # Dashboard UI
├── .mcp.json                           # MCP server config (GitHub MCP)
├── .github/
│   └── workflows/
│       ├── ci.yml                      # Lint + build on every push/PR
│       └── sonar.yml                   # SonarQube analysis on push to main
├── COPILOT.md                          # Copilot project instructions
└── README.md
```

---

## Environment Variables

Create a `.env.local` file:

```env
# SonarQube
SONARQUBE_WEBHOOK_SECRET=<your-webhook-secret>
SONARQUBE_URL=https://sonarqube.example.com
SONARQUBE_TOKEN=<your-sonarqube-token>
SONARQUBE_PROJECT_KEY=<your-project-key>

# GitHub (used by Copilot CLI + MCP)
GITHUB_TOKEN=<github-pat-with-repo-scope>
GITHUB_REPO=owner/repo-name

# GitHub Copilot
# Uses GITHUB_TOKEN instead of a proprietary AI key
```

---

## GitHub Actions

### `ci.yml` — Continuous Integration

Runs on every push and pull request.

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

### `sonar.yml` — SonarQube Analysis

Runs on push to `main`. Sends analysis results to SonarQube, which then fires the webhook back to this app when new issues are found.

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [main]

jobs:
  sonar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@v5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

---

## MCP Configuration (`.mcp.json`)

The GitHub MCP server gives GitHub Copilot CLI the tools to create branches and open PRs.

```json
{
  "mcpServers": {
    "github": {in
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## Webhook Endpoint (`/api/sonarqube/webhook`)

Accepts `POST` requests from SonarQube. On a new `OPEN` issue:

1. Validates the `X-Sonar-Webhook-HMAC-SHA256` signature.
2. Extracts issue key, rule, component, and message.
3. Runs:
   ```
   gh copilot suggest "<fix prompt>"
   ```
4. Copilot creates a branch `fix/sonar-<issueKey>`, applies the fix, and opens a PR titled `fix: resolve SonarQube issue <issueKey>`.

---

## Local Development

```bash
npm install
npm run dev          # http://localhost:3000
```

To test the webhook locally, use [ngrok](https://ngrok.com) to expose port 3000, then configure that URL in SonarQube -> Administration -> Webhooks.

---

## Deployment

Deploy to Vercel (or any Node.js host). Set all environment variables from `.env.local` in your hosting provider's secrets panel. Point the SonarQube webhook to `https://<your-domain>/api/sonarqube/webhook`.
