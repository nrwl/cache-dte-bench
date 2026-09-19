# Nx React Repository

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ A repository showcasing key [Nx](https://nx.dev) features for React monorepos ✨

🚀 If you haven't connected to Nx Cloud yet, [complete your setup here](https://cloud.nx.app/get-started). Get faster builds with remote caching, distributed task execution, and self-healing CI. [See how your workspace can benefit](#nx-cloud).

## 📊 Benchmark baseline

This repository is the **baseline** for the Nx caching and distributed task execution benchmark.
CI here runs one target per VM with no distribution, so each job's wall time measures the work
done on a single machine.

The optimized counterpart, which runs the same workload through Nx Cloud agents, lives at
[nrwl/cache-dte-bench-2](https://github.com/nrwl/cache-dte-bench-2). See that repository for
more information about the benchmark and its results.

## 📦 Project Overview

This repository demonstrates a production-ready React monorepo with:

- **2 Applications**

  - `shop` - React e-commerce application with product listings and detail views
  - `api` - Backend API serving product data

- **7 Libraries**

  - `@org/shop-feature-products` - Product listing feature (React)
  - `@org/shop-feature-product-detail` - Product detail feature (React)
  - `@org/shop-data` - Data access layer for shop features
  - `@org/shop-shared-ui` - Shared UI components
  - `@org/models` - Shared data models
  - `@org/api-products` - API product service library
  - `@org/shared-test-utils` - Shared testing utilities

- **E2E Testing**
  - `shop-e2e` - Playwright tests for the shop application

- **Generated benchmark libraries** (500 projects, ~300k lines of TypeScript)

  - `@org/shop-feature-*` - 300 feature libraries (30 domains x 10 kinds), each mounted at `/features/<name>`
  - `@org/shop-ui-*` - 130 UI component libraries
  - `@org/shop-util-*` - 70 utility libraries
  - `apps/shop-e2e/src/features/*.spec.ts` - 100 Playwright specs sampled evenly across the features (1 test each)

  Every e2e spec imports the feature library it exercises, so the project graph links `shop-e2e` to the sampled features.
  Each generated e2e test spends `E2E_TEST_DURATION_MS` (default 25000ms) waiting and
  `E2E_TEST_CPU_SECONDS` (default 2s) computing, interleaved across `E2E_TEST_BLOCKS`
  (default 10) rounds, see `apps/shop-e2e/src/support/pacing.ts`. That is ~27s per test,
  of which ~7% scales with hardware, matching real Playwright being mostly wait-bound.
  The 100 tests take roughly 45 minutes on one Playwright worker in CI. Set
  `E2E_TEST_DURATION_MS=0 E2E_TEST_CPU_SECONDS=0` to run at full speed locally.

### Simulated load

Unit tests model a realistic Vitest profile rather than pure sleep. Each spec file costs:

| Phase               | Env var                 | Default | Scales with hardware |
| ------------------- | ----------------------- | ------- | -------------------- |
| Fixed-work CPU burn | `UNIT_TEST_CPU_SECONDS` | 5s      | yes                  |
| Idle wait           | `UNIT_TEST_SLEEP_MS`    | 7300ms  | no                   |

The two are interleaved across `UNIT_TEST_BLOCKS` (default 10) rounds of compute-then-sleep,
which is closer to how a real Vitest run alternates between CPU work and waiting.

At 12.3s per file across 1,111 spec files, the `test` target takes roughly 57 minutes
at `--parallel=4`.

The CPU half runs a fixed number of iterations (`tools/test-delay/burn.mjs`), not a
fixed duration, so faster runners finish it sooner. That is what makes runner
comparisons meaningful; a `setTimeout` would take the same wall time on any machine.
The loop is a serial dependent integer chain with no allocation, so it tracks clock
speed and multiply latency rather than allocator, memory bandwidth and GC.

`UNITS_PER_SECOND` in `burn.mjs` is calibrated for one GitHub Actions vCPU. To
re-calibrate, run this **on a runner** and paste in the result:

```bash
node tools/test-delay/calibrate.mjs
```

Every project pins Vitest to a single fork, so Nx `--parallel` is the only source of
concurrency and the burn genuinely gets one core. Set `UNIT_TEST_CPU_SECONDS=0
UNIT_TEST_SLEEP_MS=0` to run unit tests at full speed locally.
The libraries, app routes and specs are produced by `tools/generate-shop-libs.mjs`. Regenerate with:

```bash
node tools/generate-shop-libs.mjs && npm install && npx nx sync
```

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-fork-url>
cd <your-repository-name>

# Install dependencies
npm install

# Serve the React shop application (this will simultaneously serve the API backend)
npx nx run @org/shop:serve

# ...or you can serve the API separately
npx nx run @org/api:serve

# Build all projects
npx nx run-many -t build

# Run tests
npx nx run-many -t test

# Lint all projects
npx nx run-many -t lint

# Run e2e tests
npx nx run @org/shop-e2e:e2e

# Run tasks in parallel

npx nx run-many -t lint test build e2e --parallel=3

# Visualize the project graph
npx nx graph
```

## ⭐ Featured Nx Capabilities

This repository showcases several powerful Nx features:

### 1. 🔒 Module Boundaries

Enforces architectural constraints using tags. Each project has specific dependencies it can use:

- `scope:shared` - Can be used by all projects
- `scope:shop` - Shop-specific libraries
- `scope:api` - API-specific libraries
- `type:feature` - Feature libraries
- `type:data` - Data access libraries
- `type:ui` - UI component libraries

**Try it out:**

```bash
# See the current project graph and boundaries
npx nx graph

# View a specific project's details
npx nx show project @org/shop --web
```

[Learn more about module boundaries →](https://nx.dev/docs/features/enforce-module-boundaries)

### 2. 🎭 Playwright E2E Testing

End-to-end testing with Playwright is pre-configured:

```bash
# Run e2e tests
npx nx run @org/shop-e2e:e2e

# Run e2e tests in CI mode
npx nx run @org/shop-e2e:e2e-ci
```

[Learn more about E2E testing →](https://nx.dev/docs/technologies/test-tools/playwright)

### 3. ⚡ Vitest for Unit Testing

Fast unit testing with Vitest for React libraries:

```bash
# Test a specific library
npx nx run @org/shop-data:test

# Test all projects
npx nx run-many -t test
```

[Learn more about Vite testing →](https://nx.dev/docs/technologies/build-tools/vite)

### 4. 🔧 Self-Healing CI

The CI pipeline includes `nx fix-ci` which automatically identifies and suggests fixes for common issues:

```bash
# In CI, this command provides automated fixes
npx nx fix-ci
```

This feature helps maintain a healthy CI pipeline by automatically detecting and suggesting solutions for:

- Missing dependencies
- Incorrect task configurations
- Cache invalidation issues
- Common build failures

[Learn more about self-healing CI →](https://nx.dev/docs/features/ci-features/self-healing-ci)

## 📁 Project Structure

```
├── apps/
│   ├── shop/           [scope:shop]    - React e-commerce app
│   ├── shop-e2e/                       - E2E tests for shop
│   └── api/            [scope:api]     - Backend API
├── packages/
│   ├── shop/
│   │   ├── feature-products/        [scope:shop,type:feature] - Product listing
│   │   ├── feature-product-detail/  [scope:shop,type:feature] - Product details
│   │   ├── data/                    [scope:shop,type:data]    - Data access
│   │   └── shared-ui/               [scope:shop,type:ui]      - UI components
│   ├── api/
│   │   └── products/    [scope:api]    - Product service
│   └── shared/
│       ├── models/      [scope:shared,type:data] - Shared models
│       └── test-utils/  [scope:shared]           - Testing utilities
├── nx.json             - Nx configuration
├── tsconfig.json       - TypeScript configuration
└── eslint.config.mjs   - ESLint with module boundary rules
```

## 🏷️ Understanding Tags

This repository uses tags to enforce module boundaries:

| Project                 | Tags                         | Can Import From              |
| ----------------------- | ---------------------------- | ---------------------------- |
| `shop`                  | `scope:shop`                 | `scope:shop`, `scope:shared` |
| `api`                   | `scope:api`                  | `scope:api`, `scope:shared`  |
| `shop-feature-products` | `scope:shop`, `type:feature` | `scope:shop`, `scope:shared` |
| `shop-data`             | `scope:shop`, `type:data`    | `scope:shared`               |
| `models`                | `scope:shared`, `type:data`  | Nothing (base library)       |

## 📚 Useful Commands

```bash
# Project exploration
npx nx graph                                    # Interactive dependency graph
npx nx list                                     # List installed plugins
npx nx show project @org/shop --web                 # View project details

# Development
npx nx run @org/shop:serve                              # Serve React app
npx nx run @org/api:serve                               # Serve backend API
npx nx run @org/shop:build                              # Build React app
npx nx run @org/shop-data:test                          # Test a specific library
npx nx run @org/shop-feature-products:lint              # Lint a specific library

# Running multiple tasks
npx nx run-many -t build                       # Build all projects
npx nx run-many -t test --parallel=3          # Test in parallel
npx nx run-many -t lint test build            # Run multiple targets

# Affected commands (great for CI)
npx nx affected -t build                       # Build only affected projects
npx nx affected -t test                        # Test only affected projects
```

## 🎯 Adding New Features

### Generate a new React application:

```bash
npx nx g @nx/react:app my-app
```

### Generate a new React library:

```bash
npx nx g @nx/react:lib my-lib
```

### Generate a new React component:

```bash
npx nx g @nx/react:component my-component --project=my-lib
```

### Generate a new API library:

```bash
npx nx g @nx/node:lib my-api-lib
```

You can use `npx nx list` to see all available plugins and `npx nx list <plugin-name>` to see all generators for a specific plugin.

## Nx Cloud

Nx Cloud ensures a [fast and scalable CI](https://nx.dev/nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/docs/features/ci-features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/docs/features/ci-features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/docs/features/ci-features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/docs/features/ci-features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/docs/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## 🔗 Learn More

- [Nx Documentation](https://nx.dev/docs)
- [Crafting Your Workspace Tutorial](https://nx.dev/docs/getting-started/tutorials/crafting-your-workspace)
- [Module Boundaries](https://nx.dev/docs/features/enforce-module-boundaries)
- [Playwright Testing](https://nx.dev/docs/technologies/test-tools/playwright)
- [Vite](https://nx.dev/docs/technologies/build-tools/vite)
- [Docker Integration](https://nx.dev/docs/guides/nx-release/release-docker-images)
- [Nx Cloud](https://nx.dev/nx-cloud)

## 💬 Community

Join the Nx community:

- [Discord](https://go.nx.dev/community)
- [X (Twitter)](https://twitter.com/nxdevtools)
- [LinkedIn](https://www.linkedin.com/company/nrwl)
- [YouTube](https://www.youtube.com/@nxdevtools)
- [Blog](https://nx.dev/blog)
